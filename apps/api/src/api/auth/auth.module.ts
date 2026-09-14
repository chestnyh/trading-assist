import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { CsrfGuard } from './guards/csrf.guard';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';
import { CryptoUtilsModule } from '@trading-bot/crypto-utils';
import { UsersApiModule } from '../users/users.api.module';

@Module({
  imports: [
    UsersApiModule,
    ServicesConfigsModule,
    CryptoUtilsModule,
    JwtModule.registerAsync({
      imports: [ServicesConfigsModule],
      useFactory: async (configService: ServicesConfigs) => ({
        secret: configService.get('JWT_SECRET') as string,
      }),
      inject: [ServicesConfigs],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    JwtStrategy,
    RolesGuard,
    { provide: APP_GUARD, useClass: CsrfGuard },
  ],
  exports: [AuthService, SessionService, RolesGuard],
})
export class AuthModule {}
