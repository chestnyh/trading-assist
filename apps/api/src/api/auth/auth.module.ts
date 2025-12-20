import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';
import { ModelsModule } from '@trading-bot/models';
import { CryptoUtilsModule } from '@trading-bot/crypto-utils';
import { UsersApiModule } from '../users/users.api.module';

@Module({
  imports: [
    UsersApiModule,
    CryptoUtilsModule,
    ServicesConfigsModule,
    JwtModule.registerAsync({
      imports: [ServicesConfigsModule],
      useFactory: async (configService: ServicesConfigs) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ServicesConfigs],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
