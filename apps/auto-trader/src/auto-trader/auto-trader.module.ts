import { Module } from '@nestjs/common';

import { ActionsRunnerModule } from '../actions-runner/actions-runner.module';

import { AutoTraderService } from './auto-trader.service';

@Module({
  imports: [
    ActionsRunnerModule,
  ],
  controllers: [],
  providers: [
    AutoTraderService,
  ],
})
export class AutoTraderModule {}
