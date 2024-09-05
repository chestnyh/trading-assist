import { Controller, Get } from '@nestjs/common';

import { UsersApiService } from './users.api.service';

@Controller('/users')
export class UsersApiController {
  constructor(private readonly appService: UsersApiService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
