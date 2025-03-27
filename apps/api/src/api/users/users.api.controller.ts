import { Controller, Get, Post, Put, Body } from '@nestjs/common';

import { UsersApiService } from './users.api.service';

@Controller('/users')
export class UsersApiController {
  constructor(private readonly appService: UsersApiService) {}

  @Post()
  async createUser(@Body() createUserDto: any) {
    return this.appService.create(createUserDto);
  }
}
