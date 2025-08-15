import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UsersApiService } from './users.api.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('/users')
export class UsersApiController {
  constructor(private readonly appService: UsersApiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User created' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.create(createUserDto);
  }
}