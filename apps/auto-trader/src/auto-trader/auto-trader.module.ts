import { Module } from '@nestjs/common';

import { RuleRunnerService } from './rule-runner.service';
import { RuleOrchestrationService } from './rule-orchestration.service';

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
        environment: cfg.get('NODE_ENV')!,
        enableConsole: cfg.getBoolean('LOG_ENABLE_CONSOLE', true),
        enableElasticsearch: cfg.getBoolean('LOG_ENABLE_ELASTICSEARCH', false),
        elasticsearch:
          cfg.get('LOG_ELASTICSEARCH_NODE') && cfg.get('LOG_ELASTICSEARCH_INDEX')
            ? {
                node: cfg.get('LOG_ELASTICSEARCH_NODE')!,
                index: cfg.get('LOG_ELASTICSEARCH_INDEX')!,
                auth: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')
                  ? { header: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')! }
                  : cfg.get('LOG_ELASTICSEARCH_API_KEY')
                    ? { apiKey: cfg.get('LOG_ELASTICSEARCH_API_KEY')! }
                    : cfg.get('LOG_ELASTICSEARCH_USERNAME') && cfg.get('LOG_ELASTICSEARCH_PASSWORD')
                      ? {
                          username: cfg.get('LOG_ELASTICSEARCH_USERNAME')!,
                          password: cfg.get('LOG_ELASTICSEARCH_PASSWORD')!,
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
          port: Number(config.get('RMQ_PORT')),
          username: config.get('RMQ_USER'),
          password: config.get('RMQ_PASSWORD'),
        },
        topology: {
          exchange: 'service_comm.topic',
        },
      },
    }),
    ModelsModule.forRoot({
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      user: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
    }),
  ],
  controllers: [],
  providers: [
    RuleRunnerService,
    RuleOrchestrationService,
  ],
})
export class AutoTraderModule {}
