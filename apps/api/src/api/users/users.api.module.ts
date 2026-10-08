import { Module } from '@nestjs/common';
import { CryptoUtilsModule } from '@trading-assist/crypto-utils';
import { UsersApiService } from './users.api.service';
import { UsersApiController } from './users.api.controller';


@Module({
  imports: [
    CryptoUtilsModule,
  ],
  controllers: [UsersApiController],
  providers: [UsersApiService],
  exports: [UsersApiService],
})
export class UsersApiModule {}
