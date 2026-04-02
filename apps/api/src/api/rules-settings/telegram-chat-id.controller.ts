import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RulesSettingsService } from './rules-settings.service';
import { TelegramChatIdResponseDto } from './dto/telegram-chat-id-response.dto';

@ApiTags('rules-settings')
@Controller('telegram-chat-id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TelegramChatIdController {
  constructor(private readonly rulesSettingsService: RulesSettingsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get Telegram chat ID for a rule setting' })
  @ApiParam({ name: 'id', type: Number, description: 'Rule setting ID' })
  @ApiOkResponse({ description: 'Telegram chat ID', type: TelegramChatIdResponseDto })
  async getTelegramChatId(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.rulesSettingsService.getTelegramChatId(id, req.user.id);
  }
}
