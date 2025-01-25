import { Module } from '@nestjs/common';
import { HeapModule } from '../heap/heap.module';

import { ActionsService } from './actions.service';

@Module({
  imports: [
    HeapModule
  ],
  exports: [
    ActionsService
  ],
  controllers: [],
  providers: [
    ActionsService
  ],
})
export class ActionsModule {}
