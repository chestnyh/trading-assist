import { Module } from '@nestjs/common';

import { UsersApiModule } from "./users/users.api.module";
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UsersApiModule
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
