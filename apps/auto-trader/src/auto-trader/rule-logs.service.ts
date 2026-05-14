import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ServicesConfigs } from '@trading-bot/configs';
import Redis from 'ioredis';

export interface RuleLogEntry {
  ruleId: number;
  userId: number;
  runId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  type: 'text' | 'json';
  message?: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class RuleLogsService implements OnModuleDestroy {
  private redis: Redis | null = null;
  private readonly MAX_STREAM_LENGTH = 2000;

  constructor(private configs: ServicesConfigs) {
    this.initRedis();
  }

  private initRedis(): void {
    const host = this.configs.get('REDIS_HOST');
    const port = this.configs.get('REDIS_PORT');
    const password = this.configs.get('REDIS_PASSWORD');

    if (!host || !port) {
      console.warn('[RuleLogsService] Redis not configured, logs will not be published');
      return;
    }

    try {
      this.redis = new Redis({
        host: host as string,
        port: Number(port),
        password: (password as string) || undefined,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn('[RuleLogsService] Redis connection failed after 3 retries, disabling');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
        maxRetriesPerRequest: 3,
      });

      this.redis.on('error', (err) => {
        console.error('[RuleLogsService] Redis error:', err.message);
      });

      this.redis.on('connect', () => {
        console.log('[RuleLogsService] Connected to Redis');
      });
    } catch (err) {
      console.error('[RuleLogsService] Failed to initialize Redis:', err);
      this.redis = null;
    }
  }

  async publishLog(entry: RuleLogEntry): Promise<void> {
    if (!this.redis) {
      return;
    }

    const streamKey = `rule-logs:${entry.ruleId}`;

    try {
      await this.redis.xadd(
        streamKey,
        'MAXLEN',
        '~',
        this.MAX_STREAM_LENGTH,
        '*',
        'entry',
        JSON.stringify(entry)
      );
    } catch (err) {
      console.error('[RuleLogsService] Failed to publish log:', err);
    }
  }

  onModuleDestroy(): void {
    if (this.redis) {
      this.redis.disconnect();
    }
  }
}
