import { join } from 'node:path';

import { Configs } from "./configs";
import { findWorkspaceRoot } from "./workspace-root";

import { ProcessEnvConfigSource } from './sources/process-env.source';
import { EnvFileConfigSource } from './sources/env-file.source';

/**
 * Configuration for backend services: API, database, RabbitMQ, Redis, logging, auth, etc.
 *
 * Values are loaded from `process.env` in production, from `.env.api-int-tests`
 * for API integration tests, and from `.env.dev` otherwise.
 */
export class ServicesConfigs extends Configs {

  setUpConfigsFromInit() {
    this.configs = {
      ...this.configs,
      API_BASE_URL: this.initialConfig['API_BASE_URL'],
      API_HOST: this.initialConfig['API_HOST'] ?? 'http://localhost',
      API_PORT: this.initialConfig['API_PORT'] ?? '3001',
      DB_USER: this.initialConfig['DB_USER'],
      DB_PASSWORD: this.initialConfig['DB_PASSWORD'],
      DB_NAME: this.initialConfig['DB_NAME'],
      DB_HOST: this.initialConfig['DB_HOST'],
      DB_PORT: this.initialConfig['DB_PORT'] ?? '5432',
      RMQ_HOST: this.initialConfig['RMQ_HOST'] ?? 'localhost',
      RMQ_PORT: this.initialConfig['RMQ_PORT'] ?? '5672',
      RMQ_MANAGEMENT_PORT: this.initialConfig['RMQ_MANAGEMENT_PORT'] ?? '15672',
      RMQ_USER: this.initialConfig['RMQ_USER'] ?? 'guest',
      RMQ_PASSWORD: this.initialConfig['RMQ_PASSWORD'] ?? 'guest',
      LOG_ENABLE_CONSOLE: this.initialConfig['LOG_ENABLE_CONSOLE'],
      LOG_ENABLE_ELASTICSEARCH: this.initialConfig['LOG_ENABLE_ELASTICSEARCH'],
      LOG_ELASTICSEARCH_NODE: this.initialConfig['LOG_ELASTICSEARCH_NODE'],
      LOG_ELASTICSEARCH_INDEX: this.initialConfig['LOG_ELASTICSEARCH_INDEX'],
      LOG_ELASTICSEARCH_AUTH_HEADER: this.initialConfig['LOG_ELASTICSEARCH_AUTH_HEADER'],
      LOG_ELASTICSEARCH_API_KEY: this.initialConfig['LOG_ELASTICSEARCH_API_KEY'],
      LOG_ELASTICSEARCH_USERNAME: this.initialConfig['LOG_ELASTICSEARCH_USERNAME'],
      LOG_ELASTICSEARCH_PASSWORD: this.initialConfig['LOG_ELASTICSEARCH_PASSWORD'],
      JWT_SECRET: this.initialConfig['JWT_SECRET'],
      JWT_EXPIRES_IN: this.initialConfig['JWT_EXPIRES_IN'] ?? '24h',
      MAX_PASSWORD_RESET_ATTEMPTS: this.initialConfig['MAX_PASSWORD_RESET_ATTEMPTS'] ?? '5',
      OUTBOX_CLEANUP_BATCH_SIZE: this.initialConfig['OUTBOX_CLEANUP_BATCH_SIZE'] ?? '500',
      OUTBOX_CLEANUP_INTERVAL_MS: this.initialConfig['OUTBOX_CLEANUP_INTERVAL_MS'] ?? '60000',
      OUTBOX_RETENTION_HOURS: this.initialConfig['OUTBOX_RETENTION_HOURS'] ?? '24',
      REDIS_HOST: this.initialConfig['REDIS_HOST'] ?? 'localhost',
      REDIS_PORT: this.initialConfig['REDIS_PORT'] ?? '6379',
      REDIS_PASSWORD: this.initialConfig['REDIS_PASSWORD'] ?? '',
      LOG_STREAM_PORT: this.initialConfig['LOG_STREAM_PORT'] ?? '3002',
      LOG_STREAM_BASE_URL: this.initialConfig['LOG_STREAM_BASE_URL']
    };
  }

  setUpConfigSource() {
    const nodeEnv = process.env['NODE_ENV'];
    let configSource;
    switch ( nodeEnv ){
        case 'production':
          configSource = new ProcessEnvConfigSource();
          break;
        case 'api-int-tests':
          configSource = new EnvFileConfigSource(join(findWorkspaceRoot(), ".env.api-int-tests")); 
          break;
        default:
          configSource = new EnvFileConfigSource(join(findWorkspaceRoot(), ".env.dev"));   
    }
    return configSource;
  }

}
