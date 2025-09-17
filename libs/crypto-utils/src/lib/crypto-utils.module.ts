import { Module } from '@nestjs/common';
import { CryptoUtilsService } from './crypto-utils.service';

@Module({
  providers: [CryptoUtilsService],
  exports: [CryptoUtilsService],
})
export class CryptoUtilsModule {}
