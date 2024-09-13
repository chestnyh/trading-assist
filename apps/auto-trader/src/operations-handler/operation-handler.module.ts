import { Module } from '@nestjs/common';

import { OperationHubModule } from '../operations-hub/operations-hub.module';

import { OperationHandlerService } from './operation-handler.service';

@Module({
  imports: [OperationHubModule],
  exports: [OperationHandlerService],
  controllers: [],
  providers: [
    OperationHandlerService,
  ],
})
export class OperationHandlerModule {}
