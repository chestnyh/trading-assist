import { Module } from '@nestjs/common';
import { CryptoUtilsModule } from '@trading-bot/crypto-utils';
import { ModelsModule } from '@trading-bot/models';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';
import { UsersApiService } from './users.api.service';
import { UsersApiController } from './users.api.controller';


@Module({
  imports: [
    ServicesConfigsModule,
    CryptoUtilsModule,
  ],
  controllers: [UsersApiController],
  providers: [UsersApiService],
  exports: [UsersApiService],
})
export class UsersApiModule {}
