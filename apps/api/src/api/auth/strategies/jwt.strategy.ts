import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ServicesConfigs } from '@trading-bot/configs';
import { UsersApiService } from '../../users/users.api.service';
import { ACCESS_COOKIE } from '../cookies';
import { RequestLike } from '../http';

export const API_JWT_AUDIENCE = 'api';

type JwtPayload = {
  sub: number;
  email: string;
  nickname: string;
  role?: string;
  country?: string;
};

export function extractAccessCookie(request: RequestLike): string | null {
  return request?.cookies?.[ACCESS_COOKIE] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersApiService,
    private configProvider: ServicesConfigs,
  ) {
    const jwtSecret = configProvider.get('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: extractAccessCookie,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      audience: API_JWT_AUDIENCE,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
