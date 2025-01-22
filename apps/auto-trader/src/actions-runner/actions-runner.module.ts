import { Module } from '@nestjs/common';

import { ActionsRunnerService } from './actions-runner.service';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [
    ActionsModule
  ],
  controllers: [],
  providers: [
    ActionsRunnerService,
  ],
  exports: [
    ActionsRunnerService
  ]
})
export class ActionsRunnerModule {}
