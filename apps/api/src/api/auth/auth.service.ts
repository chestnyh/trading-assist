import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelsService } from '@trading-bot/models';
import { ServicesConfigs } from '@trading-bot/configs';
import { CryptoUtilsService } from '@trading-bot/crypto-utils';
import { randomUUID, randomInt } from 'crypto';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private modelsService: ModelsService,
    private configService: ServicesConfigs,
    private cryptoService: CryptoUtilsService,
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

  /**
   * Request password reset - generates token and code, sends email
   */
  async forgotPassword(email: string) {
    try {
      console.log(`[forgotPassword] Processing request for email: ${email}`);
      
      // Find user by email
      const user = await this.modelsService.user.findFirst({
        where: { email },
      });

      console.log(`[forgotPassword] User found: ${user ? 'yes' : 'no'}`);

      // For security reasons, always return success message even if user doesn't exist
      // This prevents email enumeration attacks
      if (!user) {
        // Return success response but don't send email
        const dummyToken = randomUUID();
        console.log(`[forgotPassword] User not found, returning dummy token`);
        return {
          token: dummyToken,
          message: 'If an account with this email exists, a password reset code has been sent to your email.',
        };
      }

      // Generate password reset token and code
      const passwordResetToken = randomUUID();
      const passwordResetCode = randomInt(100000, 999999).toString();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

      console.log(`[forgotPassword] Generated token and code for user ${user.id}`);

      // Update user with password reset token and code
      await this.modelsService.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken,
          passwordResetCode,
          passwordResetTokenExpiresAt: expiresAt,
        },
      });

      console.log(`[forgotPassword] User updated successfully`);

      // TODO: Send email with verification code
      // For now, we'll just log it (in production, implement email sending)
      console.log(`Password reset code for ${email}: ${passwordResetCode}`);

      return {
        token: passwordResetToken,
        message: 'If an account with this email exists, a password reset code has been sent to your email.',
      };
    } catch (error) {
      console.error(`[forgotPassword] Error:`, error);
      throw error;
    }
  }

  /**
   * Verify password reset code
   */
  async verifyPasswordReset(token: string, code: string) {
    // Find user by password reset token
    const user = await this.modelsService.user.findFirst({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Check if token has expired
    if (user.passwordResetTokenExpiresAt && new Date() > user.passwordResetTokenExpiresAt) {
      throw new BadRequestException('Verification code has expired. Please request a new code.');
    }

    // Verify the code matches
    if (user.passwordResetCode !== code) {
      throw new BadRequestException('Invalid verification code. Please check your email and try again.');
    }

    // Token and code are valid, user can proceed to reset password
    return {
      message: 'Verification code verified successfully',
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    // Find user by password reset token
    const user = await this.modelsService.user.findFirst({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Check if token has expired
    if (user.passwordResetTokenExpiresAt && new Date() > user.passwordResetTokenExpiresAt) {
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Check if token has already been used (passwordResetCode should be cleared after use)
    if (!user.passwordResetCode) {
      throw new BadRequestException('This password reset link has already been used. Please request a new one.');
    }

    // Hash the new password
    const hashedPassword = await this.cryptoService.hashPassword(newPassword);

    // Update user password and clear reset token/code
    await this.modelsService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetCode: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return {
      message: 'Password has been reset successfully',
    };
  }

}
