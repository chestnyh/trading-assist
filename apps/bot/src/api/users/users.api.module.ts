import { Module } from '@nestjs/common';

import { UsersApiService } from './users.api.service';
import { UsersApiController } from './users.api.controller';

@Module({
  imports: [],
  controllers: [UsersApiController],
  providers: [UsersApiService],
})
export class UsersApiModule {}
