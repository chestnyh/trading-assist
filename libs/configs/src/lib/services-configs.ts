import { Configs } from "./configs";

/**
 * TODO add description
 */
export class ServicesConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      ...this.configs,
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
      JWT_SECRET: process.env['JWT_SECRET'] || 'your-secret-key',
      JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '24h',
      MAX_PASSWORD_RESET_ATTEMPTS: process.env['MAX_PASSWORD_RESET_ATTEMPTS'] || '5',

      OUTBOX_CLEANUP_BATCH_SIZE: process.env['OUTBOX_CLEANUP_BATCH_SIZE'] || '500',
      OUTBOX_CLEANUP_INTERVAL_MS: process.env['OUTBOX_CLEANUP_INTERVAL_MS'] || '60000',
      OUTBOX_RETENTION_HOURS: process.env['OUTBOX_RETENTION_HOURS'] || '24',
    };
  }
}
