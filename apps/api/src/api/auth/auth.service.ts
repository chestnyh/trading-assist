import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      nickname: user.nickname 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        name: user.name,
      },
    };
  }

}
