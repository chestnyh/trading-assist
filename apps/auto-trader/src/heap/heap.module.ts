import { Module } from '@nestjs/common';
import { HeapService } from './heap.service';

@Module({
  imports: [],
  exports: [
    HeapService
  ],
  controllers: [],
  providers: [
    HeapService
  ],
})
export class HeapModule {}

