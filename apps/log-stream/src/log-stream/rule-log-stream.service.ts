import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ServicesConfigs } from '@trading-bot/configs';
import Redis from 'ioredis';
import type { RuleLogEntry } from './rule-log-entry.interface';

export type { RuleLogEntry };

const REPLAY_COUNT = 100;
const POLL_INTERVAL_MS = 500;

@Injectable()
export class RuleLogStreamService implements OnModuleDestroy {
  private readonly logger = new Logger(RuleLogStreamService.name);
  private redis: Redis | null = null;

  constructor(private readonly configs: ServicesConfigs) {
    this.initRedis();
  }

  private initRedis(): void {
    const host = this.configs.get('REDIS_HOST');
    const port = this.configs.get('REDIS_PORT');
    const password = this.configs.get('REDIS_PASSWORD');

    if (!host || !port) {
      this.logger.warn('Redis not configured, log streaming will not be available');
      return;
    }

    try {
      this.redis = new Redis({
        host: host as string,
        port: Number(port),
        password: (password as string) || undefined,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis connection failed after 3 retries, disabling');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
        maxRetriesPerRequest: 3,
      });

      this.redis.on('error', (err) => {
        this.logger.error(`Redis error: ${err.message}`);
      });

      this.redis.on('connect', () => {
        this.logger.log('Connected to Redis');
      });
    } catch (err) {
      this.logger.error('Failed to initialize Redis', err);
      this.redis = null;
    }
  }

  get isAvailable(): boolean {
    return this.redis !== null;
  }

  async replayLast(ruleId: number): Promise<RuleLogEntry[]> {
    if (!this.redis) return [];

    try {
      const streamKey = `rule-logs:${ruleId}`;
      const results = await this.redis.xrevrange(streamKey, '+', '-', 'COUNT', REPLAY_COUNT);
      return results
        .reverse()
        .map(([, fields]) => this.parseEntry(fields));
    } catch (err) {
      this.logger.error(`Failed to replay logs for rule ${ruleId}`, err);
      return [];
    }
  }

  async pollFrom(
    ruleId: number,
    lastId: string,
    signal: AbortSignal,
    onEntry: (entry: RuleLogEntry) => void,
  ): Promise<void> {
    if (!this.redis) return;

    const streamKey = `rule-logs:${ruleId}`;
    let cursor = lastId;

    while (!signal.aborted) {
      try {
        const results = await this.redis.xread('COUNT', 100, 'STREAMS', streamKey, cursor);

        if (results) {
          for (const [, entries] of results) {
            for (const [id, fields] of entries) {
              onEntry(this.parseEntry(fields));
              cursor = id;
            }
          }
        }
      } catch (err) {
        if (!signal.aborted) {
          this.logger.error(`Poll error for rule ${ruleId}: ${(err as Error).message}`);
        }
      }

      if (!signal.aborted) {
        await this.sleep(POLL_INTERVAL_MS, signal);
      }
    }
  }

  private parseEntry(fields: string[]): RuleLogEntry {
    for (let i = 0; i < fields.length - 1; i += 2) {
      if (fields[i] === 'entry') {
        try {
          return JSON.parse(fields[i + 1]) as RuleLogEntry;
        } catch {
          return { message: fields[i + 1] } as RuleLogEntry;
        }
      }
    }
    return {} as RuleLogEntry;
  }

  private sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
    });
  }

  onModuleDestroy(): void {
    if (this.redis) {
      this.redis.disconnect();
    }
  }
}
