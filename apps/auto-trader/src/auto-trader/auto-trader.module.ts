import { Module } from '@nestjs/common';

import { CollectorModule } from '../collector/collector.module';

import { AutoTraderService } from './auto-trader.service';


@Module({
  imports: [CollectorModule],
  controllers: [],
  providers: [
    AutoTraderService,
  ],
})
export class AutoTraderModule {}
