import { Module } from '@nestjs/common';

import { RunnerModule } from '../runner/runner.module';

import { AutoTraderService } from './auto-trader.service';


@Module({
  imports: [RunnerModule],
  controllers: [],
  providers: [
    AutoTraderService,
  ],
})
export class AutoTraderModule {}
