import { Module } from '@nestjs/common';

import { ActionsService } from './actions.service';

@Module({
  imports: [
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
