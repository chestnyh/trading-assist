import * as dotenv from 'dotenv';
import { Configs } from "./configs";

/**
 * TODO add description
 */
export class ServicesConfigs extends Configs {
  constructor() {
    super();

    if (process?.env?.['NODE_ENV'] === 'api-int-tests') {
      dotenv.config({ path: './.env.api-int-tests' });
    }
    else if (process?.env?.['NODE_ENV'] !== 'production') {
      dotenv.config({ path: './.env.dev' });
    }
    this.configs = {
      PORT: process.env['PORT'] ? parseInt(process.env['PORT'], 10).toString() : '3000',
      DB_USER: process.env['DB_USER'],
      DB_PASSWORD: process.env['DB_PASSWORD'],
      DB_NAME: process.env['DB_NAME'],
      DB_HOST: process.env['DB_HOST'],
      DB_PORT: process.env['DB_PORT'] ? parseInt(process.env['DB_PORT'], 10).toString() : '5432',
      JWT_SECRET: process.env['JWT_SECRET'] || 'your-secret-key',
      JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '24h',
    };
  }

  protected init(): void {
    this.configs = {
      PORT: process.env.PORT,
    };
  }
}