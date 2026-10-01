import { Module } from '@nestjs/common';

import { RuleRunnerService } from './rule-runner.service';
import { RuleOrchestrationService } from './rule-orchestration.service';
import { RuleLogsService } from './rule-logs.service';

import { ModelsModule } from '@trading-assist/models';
import { ServiceCommModule } from '@trading-assist/service-comm';
import { LoggerModule } from '@trading-assist/logger';

import { ServicesConfigs, ServicesConfigsModule } from '@trading-assist/configs';

const config = new ServicesConfigs();

@Module({
  imports: [
    ServicesConfigsModule,
    LoggerModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        service: 'auto-trader',
        environment: cfg.get('NODE_ENV'),
        enableConsole: cfg.getBoolean('LOG_ENABLE_CONSOLE'),
        enableElasticsearch: cfg.getBoolean('LOG_ENABLE_ELASTICSEARCH'),
        elasticsearch:
          cfg.get('LOG_ELASTICSEARCH_NODE') && cfg.get('LOG_ELASTICSEARCH_INDEX')
            ? {
                node: cfg.get('LOG_ELASTICSEARCH_NODE'),
                index: cfg.get('LOG_ELASTICSEARCH_INDEX'),
                auth: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')
                  ? { header: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER') }
                  : cfg.get('LOG_ELASTICSEARCH_API_KEY')
                    ? { apiKey: cfg.get('LOG_ELASTICSEARCH_API_KEY') }
                    : cfg.get('LOG_ELASTICSEARCH_USERNAME') && cfg.get('LOG_ELASTICSEARCH_PASSWORD')
                      ? {
                          username: cfg.get('LOG_ELASTICSEARCH_USERNAME'),
                          password: cfg.get('LOG_ELASTICSEARCH_PASSWORD'),
                        }
                      : undefined,
              }
            : undefined,
      }),
    }),
    ServiceCommModule.forRoot({
      rmq: {
        connection: {
          host: config.get('RMQ_HOST'),
          port: config.getNumber('RMQ_PORT'),
          username: config.get('RMQ_USER'),
          password: config.get('RMQ_PASSWORD'),
        },
        topology: {
          exchange: 'service_comm.topic',
        },
      },
    }),
    ModelsModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        host: cfg.get('DB_HOST'),
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
      }),
    }),
  ],
  controllers: [],
  providers: [
    RuleRunnerService,
    RuleOrchestrationService,
    RuleLogsService,
  ],
})
export class AutoTraderModule {}
