import { Module } from '@nestjs/common';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';
import { ModelsModule } from '@trading-bot/models';

import { UsersApiModule } from "./users/users.api.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ServicesConfigsModule,
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
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
