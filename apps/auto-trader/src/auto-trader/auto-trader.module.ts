import { Module } from '@nestjs/common';

import { ActionsRunnerModule } from '../actions-runner/actions-runner.module';
import { ActionsModule } from '../actions/actions.module';

import { AutoTraderService } from './auto-trader.service';
import { ActionsRunnerService } from '../actions-runner/actions-runner.service';

@Module({
  imports: [
    ActionsRunnerModule,
    ActionsModule
  ],
  controllers: [],
  providers: [
    AutoTraderService,
    ActionsRunnerService,
  ],
})
export class AutoTraderModule {}
