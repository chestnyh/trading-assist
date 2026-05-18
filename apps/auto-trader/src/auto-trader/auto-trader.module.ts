import { Module } from '@nestjs/common';

import { RuleRunnerService } from './rule-runner.service';
import { RuleOrchestrationService } from './rule-orchestration.service';
import { RuleLogsService } from './rule-logs.service';

import { ModelsModule } from '@trading-bot/models';
import { ServiceCommModule } from '@trading-bot/service-comm';
import { LoggerModule } from '@trading-bot/logger';

import { ServicesConfigs, ServicesConfigsModule } from '@trading-bot/configs';

const config = new ServicesConfigs();

@Module({
  imports: [
    ServicesConfigsModule,
    LoggerModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        service: 'auto-trader',
        environment: cfg.get('NODE_ENV') as string,
        enableConsole: cfg.get('LOG_ENABLE_CONSOLE') as boolean,
        enableElasticsearch: cfg.get('LOG_ENABLE_ELASTICSEARCH') as boolean,
        elasticsearch:
          cfg.get('LOG_ELASTICSEARCH_NODE') && cfg.get('LOG_ELASTICSEARCH_INDEX')
            ? {
                node: cfg.get('LOG_ELASTICSEARCH_NODE') as string,
                index: cfg.get('LOG_ELASTICSEARCH_INDEX') as string,
                auth: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')
                  ? { header: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER') as string }
                  : cfg.get('LOG_ELASTICSEARCH_API_KEY')
                    ? { apiKey: cfg.get('LOG_ELASTICSEARCH_API_KEY') as string }
                    : cfg.get('LOG_ELASTICSEARCH_USERNAME') && cfg.get('LOG_ELASTICSEARCH_PASSWORD')
                      ? {
                          username: cfg.get('LOG_ELASTICSEARCH_USERNAME') as string,
                          password: cfg.get('LOG_ELASTICSEARCH_PASSWORD') as string,
                        }
                      : undefined,
              }
            : undefined,
      }),
    }),
    ServiceCommModule.forRoot({
      rmq: {
        connection: {
          host: config.get('RMQ_HOST') as string,
          port: Number(config.get('RMQ_PORT')),
          username: config.get('RMQ_USER') as string,
          password: config.get('RMQ_PASSWORD') as string,
        },
        topology: {
          exchange: 'service_comm.topic',
        },
      },
    }),
    ModelsModule.forRoot({
      host: config.get('DB_HOST') as string,
      port: config.get('DB_PORT') as string,
      user: config.get('DB_USER') as string,
      password: config.get('DB_PASSWORD') as string,
      database: config.get('DB_NAME') as string,
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
