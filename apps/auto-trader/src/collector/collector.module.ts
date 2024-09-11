import { Module } from '@nestjs/common';

import { OperationHandlerModule } from '../operations-handler/operation-handler.module';

import { CollectorService } from './collector.service';

@Module({
  imports: [OperationHandlerModule],
  exports: [CollectorService],
  controllers: [],
  providers: [
    CollectorService,
  ],
})
export class CollectorModule {}
