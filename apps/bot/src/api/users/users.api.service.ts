import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersApiService {
  getData(): { message: string } {
    return { message: 'This is users' };
  }
}