import { Module } from '@nestjs/common';
import { TradingDataService } from './trading-data.service';


@Module({
  imports: [],
  exports: [],
  controllers: [],
  providers: [
    TradingDataService
  ],
})
export class TradingDataModule {}
