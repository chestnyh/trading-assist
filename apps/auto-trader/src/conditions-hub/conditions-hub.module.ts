import { Module } from '@nestjs/common';
import { ConditionsHubService } from './conditions-hub.service';

@Module({
  imports: [],
  exports: [ConditionsHubService],
  controllers: [],
  providers: [
    ConditionsHubService,
  ],
})
export class ConditionsHubModule{}