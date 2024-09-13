import { Module } from '@nestjs/common';
import { OperationHubService } from './operations-hub.service';

@Module({
  imports: [],
  exports: [OperationHubService],
  controllers: [],
  providers: [
    OperationHubService,
  ],
})
export class OperationHubModule{}