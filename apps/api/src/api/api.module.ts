import { Module } from '@nestjs/common';

import { UsersApiModule } from "./users/users.api.module";

@Module({
  imports: [UsersApiModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
