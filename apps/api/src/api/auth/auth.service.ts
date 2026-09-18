import { Injectable, BadRequestException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelsService } from '@trading-bot/models';
import { ServicesConfigs } from '@trading-bot/configs';
import { CryptoUtilsService } from '@trading-bot/crypto-utils';
import { randomBytes, randomUUID, randomInt } from 'crypto';
import { SessionService, IssuedRefreshCredential } from './session.service';
import { CookieJar } from './http';
import {
  clearAuthCookies,
  setAccessCookie,
  setCsrfCookie,
  setRefreshCookie,
} from './cookies';
import { parseDurationToMs } from './duration';
import { API_JWT_AUDIENCE } from './strategies/jwt.strategy';
import { UserProfileDto } from './dto/user-profile.dto';

export const STREAM_JWT_AUDIENCE = 'log-stream';
export const STREAM_TICKET_PURPOSE = 'stream';

const DEFAULT_STREAM_TICKET_MS = 60_000;

type SessionUser = {
  id: number;
  email: string;
  nickname: string;
  role?: string | null;
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private modelsService: ModelsService,
    private configService: ServicesConfigs,
    private cryptoService: CryptoUtilsService,
    private sessionService: SessionService,
  ) {}

  /**
   * Validates credentials are handled by UsersApiService; this issues the session.
   * No credential is returned in the body — it is delivered as HttpOnly cookies only.
   */
  async login(user: SessionUser, rememberMe?: boolean, res?: CookieJar): Promise<{ user: UserProfileDto }> {
    const refresh = await this.sessionService.issue(user.id, Boolean(rememberMe));

    if (res) {
      this.issueSessionCookies(res, user, refresh);
    }

    return { user: this.toUserProfile(user) };
  }

  getSessionUser(user: SessionUser): UserProfileDto {
    return this.toUserProfile(user);
  }

  /**
   * Revokes the presented refresh token's entire family and clears cookies. Idempotent.
   */
  async logout(refreshToken: string | undefined, res: CookieJar): Promise<{ success: boolean }> {
    if (refreshToken) {
      await this.sessionService.revokeByToken(refreshToken);
    }

    clearAuthCookies(res, this.configService);
    return { success: true };
  }

  /**
   * Rotates the refresh credential and reissues the cookie set.
   */
  async refresh(
    refreshToken: string | undefined,
    res: CookieJar
  ): Promise<{ user: UserProfileDto }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const rotated = await this.sessionService.rotate(refreshToken);
    const user = await this.loadUser(rotated.userId);

    this.issueSessionCookies(res, user, rotated);

    return { user: this.toUserProfile(user) };
  }

  /**
   * Issues a short-lived, narrowly-scoped ticket for the log-stream service. The ticket
   * cannot authorize API calls (different audience).
   */
  issueStreamTicket(user: SessionUser): { ticket: string; expiresIn: number } {
    const ttlMs = parseDurationToMs(
      this.configService.get('JWT_STREAM_TICKET_EXPIRES_IN'),
      DEFAULT_STREAM_TICKET_MS
    );
    const expiresIn = Math.max(1, Math.floor(ttlMs / 1000));

    const ticket = this.jwtService.sign(
      { sub: user.id, email: user.email, purpose: STREAM_TICKET_PURPOSE },
      { expiresIn, audience: STREAM_JWT_AUDIENCE }
    );

    return { ticket, expiresIn };
  }

  private async loadUser(id: number): Promise<SessionUser> {
    const user = await this.modelsService.user.findUnique({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private issueSessionCookies(
    res: CookieJar,
    user: SessionUser,
    refresh: IssuedRefreshCredential
  ): void {
    const payload = {
      email: user.email,
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
      country: user.country,
    };

    const accessTtlMs = this.sessionService.getAccessTtlMs();
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: Math.floor(accessTtlMs / 1000),
      audience: API_JWT_AUDIENCE,
    });

    setAccessCookie(res, accessToken, accessTtlMs, this.configService);
    setRefreshCookie(res, refresh.token, refresh.maxAgeMs, this.configService);
    setCsrfCookie(res, this.generateCsrfToken(), refresh.maxAgeMs, this.configService);
  }

  private generateCsrfToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private toUserProfile(user: SessionUser): UserProfileDto {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');

    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      ...(name ? { name } : {}),
      role: String(user.role ?? 'USER'),
      ...(user.country ? { country: user.country } : {}),
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
   * Validates token, updates user password, invalidates token and all sessions
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

    // Update password, consume the reset token, and end every existing session atomically
    await this.modelsService.runInTransaction(async (tx) => {
      await tx.user.update({
        where: { id: passwordReset.userId },
        data: {
          password: hashedPassword,
        },
      });

      await tx.passwordReset.delete({
        where: { id: passwordReset.id },
      });

      await this.sessionService.revokeAllForUser(passwordReset.userId, tx);
    });

    return {
      message: 'Password has been reset successfully. Please sign in with your new password.',
      success: true,
    };
  }

}
