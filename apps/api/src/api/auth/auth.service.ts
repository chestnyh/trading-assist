import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';import { JwtService } from '@nestjs/jwt';
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
    const expiresIn = rememberMe
      ? '30d'
      : (this.configService.get('JWT_EXPIRES_IN') as string) || '24h';
    
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
   * Request password reset - Step 1
   * Generates token and verification code, sends email
   */
  async forgotPassword(email: string) {
    // Find user by email
    const user = await this.modelsService.user.findUnique({
      where: { email },
    });

    // Security: Always return success message to prevent email enumeration
    // Even if user doesn't exist, return same response
    if (!user) {
      return {
        token: randomUUID(), // Generate dummy token for security
        message: 'If an account with this email exists, a password reset code has been sent to your email.',
      };
    }

    // Generate unique token and 6-digit code
    const token = randomUUID();
    const code = randomInt(100000, 999999).toString();

    // Invalidate any existing password reset requests for this user
    await this.modelsService.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Create new password reset record
    const passwordReset = await this.modelsService.passwordReset.create({
      data: {
        userId: user.id,
        token,
        code,
        verified: false,
      },
    });

    // TODO: Send email with verification code
    // await this.emailService.sendPasswordResetCode(user.email, code);

    return {
      token: passwordReset.token,
      message: 'If an account with this email exists, a password reset code has been sent to your email.',
    };
  }

  /**
   * Verify password reset code - Step 2
   * Validates token and code, marks as verified
   * Implements brute-force protection with attempt tracking
   */
  async verifyPasswordReset(token: string, code: string) {
    // Find password reset record by token
    const passwordReset = await this.modelsService.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!passwordReset) {
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Check if token has expired (1 hour expiration)
    const tokenAge = Date.now() - passwordReset.createdAt.getTime();
    const expirationTime = 60 * 60 * 1000; // 1 hour in milliseconds
    if (tokenAge > expirationTime) {
      // Clean up expired token
      await this.modelsService.passwordReset.delete({
        where: { id: passwordReset.id },
      });
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Get maximum attempts from configuration
    const maxAttempts = this.configService.get('MAX_PASSWORD_RESET_ATTEMPTS');
    const maxAttemptsNumber = parseInt(maxAttempts as string, 10);

    // Check if attempts limit has been exceeded
    if (passwordReset.attemptsCount >= maxAttemptsNumber) {
      // Delete the reset record to invalidate token
      await this.modelsService.passwordReset.delete({
        where: { id: passwordReset.id },
      });
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Maximum attempts exceeded. Please request a new password reset email.',
          remainingAttempts: 0,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Verify the code matches
    if (passwordReset.code !== code) {
      // Atomically increment attempts count
      const updatedPasswordReset = await this.modelsService.passwordReset.update({
        where: { id: passwordReset.id },
        data: {
          attemptsCount: { increment: 1 },
        },
      });

      // Check if limit was just reached after increment
      if (updatedPasswordReset.attemptsCount >= maxAttemptsNumber) {
        // Delete the reset record to invalidate token
        await this.modelsService.passwordReset.delete({
          where: { id: passwordReset.id },
        });
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Maximum attempts exceeded. Please request a new password reset email.',
            remainingAttempts: 0,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Calculate remaining attempts
      const remainingAttempts = maxAttemptsNumber - updatedPasswordReset.attemptsCount;
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid code. Remaining attempts: ${remainingAttempts}.`,
        remainingAttempts,
      });
    }

    // Code is correct - Mark as verified
    await this.modelsService.passwordReset.update({
      where: { id: passwordReset.id },
      data: {
        verified: true,
      },
    });

    return {
      message: 'Verification code verified successfully',
      success: true,
    };
  }

  /**
   * Reset password - Step 3
   * Validates token, updates user password, invalidates token
   */
  async resetPassword(token: string, newPassword: string) {
    // Find password reset record by token
    const passwordReset = await this.modelsService.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!passwordReset) {
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Check if token has expired (1 hour expiration)
    const tokenAge = Date.now() - passwordReset.createdAt.getTime();
    const expirationTime = 60 * 60 * 1000; // 1 hour in milliseconds
    if (tokenAge > expirationTime) {
      // Clean up expired token
      await this.modelsService.passwordReset.delete({
        where: { id: passwordReset.id },
      });
      throw new UnauthorizedException('Invalid or expired token. Please start the password reset process again.');
    }

    // Check if token has been verified
    if (!passwordReset.verified) {
      throw new BadRequestException('Please verify your code first before resetting your password.');
    }

    // Hash the new password
    const hashedPassword = await this.cryptoService.hashPassword(newPassword);

    // Update user password
    await this.modelsService.user.update({
      where: { id: passwordReset.userId },
      data: {
        password: hashedPassword,
      },
    });

    // Invalidate password reset token (delete the record)
    await this.modelsService.passwordReset.delete({
      where: { id: passwordReset.id },
    });

    return {
      message: 'Password has been reset successfully. Please sign in with your new password.',
      success: true,
    };
  }

}
