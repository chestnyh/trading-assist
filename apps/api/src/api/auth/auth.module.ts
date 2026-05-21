import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
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
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') as string,
        },
      }),
      inject: [ServicesConfigs],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
