import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelsService } from '@trading-bot/models';
import { ServicesConfigs } from '@trading-bot/configs';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private modelsService: ModelsService,
    private configService: ServicesConfigs,
  ) {}

  async login(user: any, rememberMe?: boolean) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      nickname: user.nickname 
    };
    
    // Set token expiration based on rememberMe option
    // If rememberMe is true, use 30 days, otherwise use default from config (24h)
    const expiresIn = rememberMe ? '30d' : this.configService.get('JWT_EXPIRES_IN') || '24h';
    
    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Verify user email with verification code
   */
  async verifyEmail(token: string, code: string) {
    // Find user by verification token
    const user = await this.modelsService.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if already verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Verify the code matches
    if (user.emailVerificationCode !== code) {
      throw new BadRequestException('Invalid verification code. Please check your email and try again.');
    }

    // Update user to verified
    await this.modelsService.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
      },
    });

    return {
      message: 'Email verified successfully',
      success: true,
    };
  }

}
