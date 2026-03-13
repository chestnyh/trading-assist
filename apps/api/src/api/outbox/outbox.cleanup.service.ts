import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { setTimeout } from 'node:timers/promises';
import { ServicesConfigs } from '@trading-bot/configs';
import { ModelsService } from '@trading-bot/models';

@Injectable()
/**
 * Periodically removes old published outbox messages to prevent the outbox table from growing indefinitely.
 *
 * Cleanup loop:
 * - selects a batch of messages where `publishedAt` is older than retention threshold
 * - deletes them by ids
 * - repeats immediately while there is still more work (batch is full)
 * - sleeps for configured interval between iterations
 */
export class OutboxCleanupService implements OnModuleInit, OnModuleDestroy {
  private isStopping = false;

  constructor(
    private readonly models: ModelsService,
    private readonly cfg: ServicesConfigs
  ) {}

  onModuleInit(): void {
    this.isStopping = false;
    void this.runLoop();
  }

  async onModuleDestroy(): Promise<void> {
    this.isStopping = true;
  }

  private computePublishedBefore(): Date {
    const retentionMs = this.cfg.getOutboxRetentionHours() * 60 * 60 * 1000;
    return new Date(Date.now() - retentionMs);
  }

  private async runLoop(): Promise<void> {
    while (!this.isStopping) {
      try {
        const batchSize = this.cfg.getOutboxCleanupBatchSize();
        const publishedBefore = this.computePublishedBefore();

        const rows = await this.models.outboxMessage.findMany({
          where: {
            publishedAt: {
              not: null,
              lt: publishedBefore,
            },
          },
          select: { id: true },
          orderBy: { publishedAt: 'asc' },
          take: batchSize,
        });

        if (rows.length > 0) {
          await this.models.outboxMessage.deleteMany({
            where: {
              id: { in: rows.map((r) => r.id) },
            },
          });
        }

        if (rows.length >= batchSize) {
          continue;
        }
      } catch {
        // ignore and retry after sleep
      }

      await setTimeout(this.cfg.getOutboxCleanupIntervalMs());
    }
  }
}
