import { Inject, Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { LOGGER_OPTIONS } from './logger.constants';
import type { LogEntry, LogError, LogLevel, LoggerModuleOptions } from '../types';

@Injectable()
/**
 * NestJS-compatible logger.
 *
 * - Console transport is enabled by default.
 * - Elasticsearch transport is enabled only when explicitly configured.
 */
export class LoggerService implements NestLoggerService {
  private readonly serviceName: string;
  private readonly environment: string;
  private readonly enableConsole: boolean;
  private readonly enableElasticsearch: boolean;
  private readonly elasticNode?: string;
  private readonly elasticIndex?: string;
  private readonly elasticHeaders?: Record<string, string>;

  constructor(
    @Inject(LOGGER_OPTIONS) private readonly options: LoggerModuleOptions
  ) {
    this.serviceName = options.service;
    this.environment = options.environment;
    this.enableConsole = options.enableConsole ?? true;
    this.enableElasticsearch = Boolean(options.enableElasticsearch);
    this.elasticNode = options.elasticsearch?.node;
    this.elasticIndex = options.elasticsearch?.index;
    this.elasticHeaders = this.buildElasticsearchHeaders(options);
  }

  private buildElasticsearchHeaders(options: LoggerModuleOptions): Record<string, string> | undefined {
    const headers: Record<string, string> = {
      ...(options.elasticsearch?.headers ?? {}),
    };

    const auth = options.elasticsearch?.auth;
    if (auth) {
      if ('header' in auth) {
        headers['authorization'] = auth.header;
      } else if ('apiKey' in auth) {
        headers['authorization'] = `ApiKey ${auth.apiKey}`;
      } else if ('username' in auth && 'password' in auth) {
        headers['authorization'] = `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString('base64')}`;
      }
    }

    return Object.keys(headers).length ? headers : undefined;
  }

  log(message: any, ...optionalParams: any[]): void {
    this.write('info', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    this.write('error', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.write('warn', message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]): void {
    this.write('debug', message, optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]): void {
    this.write('debug', message, optionalParams);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    this.writeEntry({ level: 'info', message, meta });
  }

  private write(level: LogLevel, message: any, optionalParams: any[]): void {
    const { msg, error, meta } = this.normalize(message, optionalParams);
    this.writeEntry({ level, message: msg, error, meta });
  }

  private normalize(message: any, optionalParams: any[]): {
    msg: string;
    error: LogError | null;
    meta: Record<string, unknown>;
  } {
    const meta: Record<string, unknown> = {};

    if (optionalParams.length === 1 && this.isPlainObject(optionalParams[0])) {
      Object.assign(meta, optionalParams[0] as Record<string, unknown>);
    } else if (optionalParams.length > 0) {
      meta['optionalParams'] = optionalParams;
    }

    if (message instanceof Error) {
      return {
        msg: message.message,
        error: { name: message.name, message: message.message, stack: message.stack },
        meta,
      };
    }

    if (typeof message === 'string') {
      return { msg: message, error: null, meta };
    }

    try {
      return { msg: JSON.stringify(message), error: null, meta };
    } catch {
      return { msg: String(message), error: null, meta };
    }
  }

  private writeEntry(input: {
    level: LogLevel;
    message: string;
    error?: LogError | null;
    meta?: Record<string, unknown>;
  }): void {
    const entry: LogEntry = {
      '@timestamp': new Date().toISOString(),
      level: input.level,
      message: input.message,
      service: this.serviceName,
      environment: this.environment,
      pid: process.pid,
      error: input.error ?? null,
      meta: input.meta ?? {},
    };

    if (this.enableConsole) {
      this.consoleTransport(entry);
    }

    if (this.shouldSendToElasticsearch()) {
      void this.elasticsearchTransport(entry);
    }
  }

  private consoleTransport(entry: LogEntry): void {
    const ts = entry['@timestamp'].replace('T', ' ').replace('Z', '');
    const svc = entry.service;
    const lvl = entry.level.toUpperCase();
    const msg = entry.message;

    const line = `${ts} [${svc}] ${lvl} ${msg}`;

    if (entry.level === 'error') {
      console.error(line);
      if (entry.error?.stack) {
        console.error(entry.error.stack);
      }
      return;
    }

    if (entry.level === 'warn') {
      console.warn(line);
      return;
    }

    console.log(line);
  }

  private shouldSendToElasticsearch(): boolean {
    if (!this.enableElasticsearch) return false;
    if (!this.elasticNode || !this.elasticIndex) return false;

    return this.environment === 'production' || this.environment === 'staging';
  }

  private async elasticsearchTransport(entry: LogEntry): Promise<void> {
    try {
      const url = new URL(this.elasticNode!);
      const body = JSON.stringify(entry);
      const indexPath = `/${encodeURIComponent(this.elasticIndex!)}/_doc`;

      const res = await fetch(new URL(indexPath, url), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Optional auth/custom headers (e.g. Authorization) for protected clusters.
          ...(this.elasticHeaders ?? {}),
        },
        body,
      });

      await res.text();

      const ok = res.ok;
      if (!ok) {
        console.warn(
          `Failed to send log to Elasticsearch: ${res.status} ${res.statusText}`
        );
      }
    } catch (e) {
      console.warn(`Failed to send log to Elasticsearch: ${(e as Error).message}`);
    }
  }

  private isPlainObject(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }
}
