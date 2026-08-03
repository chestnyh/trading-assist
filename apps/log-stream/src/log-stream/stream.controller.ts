import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RuleLogStreamService } from './rule-log-stream.service';

interface AuthenticatedRequest {
  user: { id: number };
  on(event: 'close', listener: () => void): void;
}

interface SseResponse {
  setHeader(name: string, value: string): void;
  flushHeaders(): void;
  write(chunk: string): void;
  end(): void;
}

@Controller('stream')
export class StreamController {
  constructor(
    private readonly logStreamService: RuleLogStreamService,
    private readonly modelsService: ModelsService,
  ) {}

  @Get('rules/:ruleId/logs')
  @UseGuards(JwtAuthGuard)
  async streamRuleLogs(
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Req() req: AuthenticatedRequest,
    @Res() res: SseResponse,
  ): Promise<void> {
    if (!this.logStreamService.isAvailable) {
      throw new ServiceUnavailableException('Log streaming is temporarily unavailable');
    }

    const rule = await this.modelsService.userRules.findUnique({
      where: { id: ruleId },
      select: { authorId: true },
    });

    if (!rule || rule.authorId !== req.user.id) {
      throw new ForbiddenException('Rule not found or access denied');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const sendEvent = (data: unknown): void => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const replayed = await this.logStreamService.replayLast(ruleId);
    const lastId = '0-0';

    for (const entry of replayed) {
      sendEvent(entry);
    }

    const abortController = new AbortController();

    req.on('close', () => abortController.abort());

    await this.logStreamService.pollFrom(
      ruleId,
      lastId,
      abortController.signal,
      (entry) => {
        sendEvent(entry);
      },
    );

    res.end();
  }
}
