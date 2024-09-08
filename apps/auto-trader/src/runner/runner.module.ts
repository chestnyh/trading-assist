import { Module } from '@nestjs/common';

import { RunnerService } from './runner.service';

@Module({
  imports: [],
  exports: [RunnerService],
  controllers: [],
  providers: [
    RunnerService,
  ],
})
export class RunnerModule {}
