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
import { ExternalServicesModule } from './external-services/external-services.module';

@Module({
  imports: [
    ServicesConfigsModule,
    ServiceCommModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        rmq: {
          connection: {
            host: cfg.get('RMQ_HOST'),
            port: Number(cfg.get('RMQ_PORT')),
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
    // Global module
    ModelsModule.forRootAsync({
      useFactory: async (configService: ServicesConfigs) => ({
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
      }),
      inject: [ServicesConfigs],
    }),
    UsersApiModule,
    AuthModule,
    RulesModule,
    RulesSettingsModule,
    RulesSettingsTagsModule,
    ExternalServicesModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
