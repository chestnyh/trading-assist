import { Module } from '@nestjs/common';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';
import { ModelsModule } from '@trading-bot/models';
import { ServiceCommModule } from '@trading-bot/service-comm';

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
    ExternalServicesModule
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
