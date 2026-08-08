import { Module } from '@nestjs/common';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';
import { ModelsModule } from '@trading-bot/models';
import { ServiceCommModule } from '@trading-bot/service-comm';
import { LoggerModule } from '@trading-bot/logger';
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
      useFactory: (cfg: ServicesConfigs) => ({
        rmq: {
          connection: {
            host: cfg.get('RMQ_HOST') as string,
            port: Number(cfg.get('RMQ_PORT')),
            username: cfg.get('RMQ_USER') as string,
            password: cfg.get('RMQ_PASSWORD') as string,
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
    // Global module
    ModelsModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        host: cfg.get('DB_HOST') as string,
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USER') as string,
        password: cfg.get('DB_PASSWORD') as string,
        database: cfg.get('DB_NAME') as string,
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
