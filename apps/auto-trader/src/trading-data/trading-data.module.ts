import { Module } from '@nestjs/common';
import { TradingDataService } from './trading-data.service';

@Module({
  imports: [],
  exports: [
    TradingDataService
  ],
  controllers: [],
  providers: [
    TradingDataService
  ],
})
export class TradingDataModule {}

