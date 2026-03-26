export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogError {
  name?: string;
  message?: string;
  stack?: string;
}

export interface LogEntry {
  '@timestamp': string;
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  pid: number;
  error: LogError | null;
  meta: Record<string, unknown>;
}

export interface LoggerModuleOptions {
  service: string;
  environment: string;
  enableElasticsearch?: boolean;
  elasticsearch?: {
    node: string;
    index: string;
  };
}

export interface LoggerModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
}
