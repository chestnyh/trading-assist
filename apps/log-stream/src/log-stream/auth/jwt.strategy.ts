import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ServicesConfigs } from '@trading-bot/configs';
import { ModelsService } from '@trading-bot/models';

export const STREAM_JWT_AUDIENCE = 'log-stream';
export const STREAM_TICKET_PURPOSE = 'stream';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private modelsService: ModelsService,
    configProvider: ServicesConfigs,
  ) {
    const jwtSecret = configProvider.get('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.query?.token as string | undefined,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      audience: STREAM_JWT_AUDIENCE,
    });
  }

  async validate(payload: { sub: number; email: string; purpose?: string }) {
    if (payload.purpose !== STREAM_TICKET_PURPOSE) {
      throw new UnauthorizedException();
    }

    const user = await this.modelsService.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
