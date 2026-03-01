import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { getEnvelopeCreator, ServiceCommService } from '@trading-bot/service-comm';

const DEFAULT_POLL_INTERVAL_MS = 2000;
const DEFAULT_BATCH_SIZE = 50;

function computeBackoffSeconds(attempts: number): number {
  const base = Math.pow(2, Math.max(0, attempts));
  return Math.min(60, base);
}

@Injectable()
export class OutboxPublisherService implements OnModuleInit, OnModuleDestroy {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(
    private readonly models: ModelsService,
    private readonly comm: ServiceCommService
  ) {}

  onModuleInit(): void {
    this.timer = setInterval(() => {
      void this.tick();
    }, DEFAULT_POLL_INTERVAL_MS);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const now = new Date();

      const messages = await this.models.outboxMessage.findMany({
        where: {
          publishedAt: null,
          OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
        },
        orderBy: { createdAt: 'asc' },
        take: DEFAULT_BATCH_SIZE,
      });

      for (const msg of messages) {
        const envelopeCreator = getEnvelopeCreator(msg.producer);

        try {
          await this.comm.publish(
            envelopeCreator(msg.topic, msg.payload as any),
            { topic: msg.topic }
          );

          await this.models.outboxMessage.update({
            where: { id: msg.id },
            data: {
              publishedAt: new Date(),
              lastError: null,
              nextAttemptAt: null,
            },
          });
        } catch (err) {
          const attempts = msg.attempts + 1;
          const backoffSeconds = computeBackoffSeconds(attempts);
          const nextAttemptAt = new Date(Date.now() + backoffSeconds * 1000);

          await this.models.outboxMessage.update({
            where: { id: msg.id },
            data: {
              attempts,
              nextAttemptAt,
              lastError: err instanceof Error ? err.message : String(err),
            },
          });
        }
      }
    } finally {
      this.isRunning = false;
    }
  }
}
