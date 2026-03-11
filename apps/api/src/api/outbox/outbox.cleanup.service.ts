import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';

const DEFAULT_CLEANUP_BATCH_SIZE = 500;
const DEFAULT_CLEANUP_INTERVAL_MS = 60_000;
const DEFAULT_RETENTION_HOURS = 24;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class OutboxCleanupService implements OnModuleInit, OnModuleDestroy {
  private isRunning = false;
  private isStopping = false;

  constructor(private readonly models: ModelsService) {}

  onModuleInit(): void {
    this.isStopping = false;
    void this.runLoop();
  }

  async onModuleDestroy(): Promise<void> {
    this.isStopping = true;
  }

  private getCleanupBatchSize(): number {
    const value = Number(process.env['OUTBOX_CLEANUP_BATCH_SIZE'] ?? DEFAULT_CLEANUP_BATCH_SIZE);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_CLEANUP_BATCH_SIZE;
  }

  private getCleanupIntervalMs(): number {
    const value = Number(process.env['OUTBOX_CLEANUP_INTERVAL_MS'] ?? DEFAULT_CLEANUP_INTERVAL_MS);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_CLEANUP_INTERVAL_MS;
  }

  private getRetentionHours(): number {
    const value = Number(process.env['OUTBOX_RETENTION_HOURS'] ?? DEFAULT_RETENTION_HOURS);
    return Number.isFinite(value) && value >= 0 ? value : DEFAULT_RETENTION_HOURS;
  }

  private computePublishedBefore(): Date {
    const retentionMs = this.getRetentionHours() * 60 * 60 * 1000;
    return new Date(Date.now() - retentionMs);
  }

  private async runLoop(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      while (!this.isStopping) {
        const batchSize = this.getCleanupBatchSize();
        const publishedBefore = this.computePublishedBefore();

        while (!this.isStopping) {
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

          if (rows.length === 0) {
            break;
          }

          await this.models.outboxMessage.deleteMany({
            where: {
              id: { in: rows.map((r) => r.id) },
            },
          });

          if (rows.length < batchSize) {
            break;
          }
        }

        await sleep(this.getCleanupIntervalMs());
      }
    } finally {
      this.isRunning = false;
    }
  }
}
