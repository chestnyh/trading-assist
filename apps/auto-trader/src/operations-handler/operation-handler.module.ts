import { Module } from '@nestjs/common';
import { OperationHandlerService } from './operation-handler.service';

@Module({
  imports: [],
  exports: [OperationHandlerService],
  controllers: [],
  providers: [
    OperationHandlerService,
  ],
})
export class OperationHandlerModule {}
