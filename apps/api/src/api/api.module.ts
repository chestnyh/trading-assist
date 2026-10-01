import { Module } from '@nestjs/common';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-assist/configs';
import { ModelsModule } from '@trading-assist/models';
import { ServiceCommModule } from '@trading-assist/service-comm';
import { LoggerModule } from '@trading-assist/logger';
import { OutboxModule } from './outbox/outbox.module';

import { UsersApiModule } from "./users/users.api.module";
import { AuthModule } from "./auth/auth.module";
import { RulesModule } from "./rules/rules.module";
import { RulesSettingsModule } from './rules-settings/rules-settings.module';
import { RulesSettingsTagsModule } from './tags/tags.module';

@Module({
  imports: [
    ServicesConfigsModule,
    ServiceCommModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: async (cfg: ServicesConfigs) => ({
        rmq: {
          connection: {
            host: cfg.get('RMQ_HOST'),
            port: cfg.getNumber('RMQ_PORT'),
            username: cfg.get('RMQ_USER'),
            password: cfg.get('RMQ_PASSWORD'),
          },
          topology: {
            exchange: 'service_comm.topic',
          },
        },
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        service: 'api',
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
    // Global module
    ModelsModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        host: cfg.get('DB_HOST'),
        port: cfg.getNumber('DB_PORT'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
      }),
    }),
    UsersApiModule,
    AuthModule,
    RulesModule,
    RulesSettingsModule,
    RulesSettingsTagsModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
