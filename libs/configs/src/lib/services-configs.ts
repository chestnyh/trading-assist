import { Configs } from "./configs";
import { getFiniteNumber } from "./utils";

/**
 * TODO add description
 */
export class ServicesConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      ...this.configs,
      NODE_ENV: process.env['NODE_ENV'] || 'development',
      API_HOST: process.env['API_HOST'] || 'http://localhost',
      API_PORT: process.env['API_PORT'] ? parseInt(process.env['API_PORT'], 10).toString() : '3001',
      DB_USER: process.env['DB_USER'],
      DB_PASSWORD: process.env['DB_PASSWORD'],
      DB_NAME: process.env['DB_NAME'],
      DB_HOST: process.env['DB_HOST'],
      DB_PORT: process.env['DB_PORT'] ? parseInt(process.env['DB_PORT'], 10).toString() : '5432',
      RMQ_HOST: process.env['RMQ_HOST'] || 'localhost',
      RMQ_PORT: process.env['RMQ_PORT'] ? parseInt(process.env['RMQ_PORT'], 10).toString() : '5672',
      RMQ_MANAGEMENT_PORT: process.env['RMQ_MANAGEMENT_PORT']
        ? parseInt(process.env['RMQ_MANAGEMENT_PORT'], 10).toString()
        : '15672',
      RMQ_USER: process.env['RMQ_USER'] || 'guest',
      RMQ_PASSWORD: process.env['RMQ_PASSWORD'] || 'guest',
      LOG_ENABLE_CONSOLE: process.env['LOG_ENABLE_CONSOLE'] || 'true',
      LOG_ENABLE_ELASTICSEARCH: process.env['LOG_ENABLE_ELASTICSEARCH'] || 'false',
      LOG_ELASTICSEARCH_NODE: process.env['LOG_ELASTICSEARCH_NODE'],
      LOG_ELASTICSEARCH_INDEX: process.env['LOG_ELASTICSEARCH_INDEX'],
      LOG_ELASTICSEARCH_AUTH_HEADER: process.env['LOG_ELASTICSEARCH_AUTH_HEADER'],
      LOG_ELASTICSEARCH_API_KEY: process.env['LOG_ELASTICSEARCH_API_KEY'],
      LOG_ELASTICSEARCH_USERNAME: process.env['LOG_ELASTICSEARCH_USERNAME'],
      LOG_ELASTICSEARCH_PASSWORD: process.env['LOG_ELASTICSEARCH_PASSWORD'],
      JWT_SECRET: process.env['JWT_SECRET'] || 'your-secret-key',
      JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '24h',
      MAX_PASSWORD_RESET_ATTEMPTS: process.env['MAX_PASSWORD_RESET_ATTEMPTS'] || '5',

      OUTBOX_CLEANUP_BATCH_SIZE: String(getFiniteNumber(process.env['OUTBOX_CLEANUP_BATCH_SIZE'] ?? '500') ?? 500),
      OUTBOX_CLEANUP_INTERVAL_MS: String(getFiniteNumber(process.env['OUTBOX_CLEANUP_INTERVAL_MS'] ?? '60000') ?? 60_000),
      OUTBOX_RETENTION_HOURS: String(getFiniteNumber(process.env['OUTBOX_RETENTION_HOURS'] ?? '24') ?? 24),
    };
  }
}
