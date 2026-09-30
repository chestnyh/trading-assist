import { Controller, Post, Body, UseGuards, Get, Req, Res, UnauthorizedException, BadRequestException, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { CookieJar, RequestLike } from './http';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { StreamTicketResponseDto } from './dto/stream-ticket-response.dto';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { VerifyPasswordResetDto } from './dto/verify-password-reset.dto';
import { VerifyPasswordResetResponseDto } from './dto/verify-password-reset-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { UsersApiService } from '../users/users.api.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SkipCsrf } from './decorators/skip-csrf.decorator';
import { REFRESH_COOKIE } from './cookies';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersApiService
  ) {}

  @Post('login')
  @HttpCode(200)
  @SkipCsrf()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful. Session credentials are set as HttpOnly cookies.',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Email not verified' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: CookieJar
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
      
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email address before logging in. Check your email for the verification code.');
    }

    return this.authService.login(user, loginDto.rememberMe, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get the current session user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile', type: MeResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async me(@Req() req: RequestLike): Promise<MeResponseDto> {
    return this.authService.getSessionUser(req.user as never) as MeResponseDto;
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Rotate the session and issue new credentials' })
  @ApiResponse({ status: 200, description: 'Session renewed', type: RefreshResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid, expired or reused refresh token' })
  @ApiResponse({ status: 403, description: 'Invalid or missing CSRF token' })
  async refresh(
    @Req() req: RequestLike,
    @Res({ passthrough: true }) res: CookieJar
  ): Promise<RefreshResponseDto> {
    return this.authService.refresh(req.cookies?.[REFRESH_COOKIE], res);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign out and invalidate the session server-side' })
  @ApiResponse({ status: 200, description: 'Signed out', type: LogoutResponseDto })
  @ApiResponse({ status: 403, description: 'Invalid or missing CSRF token' })
  async logout(
    @Req() req: RequestLike,
    @Res({ passthrough: true }) res: CookieJar
  ): Promise<LogoutResponseDto> {
    return this.authService.logout(req.cookies?.[REFRESH_COOKIE], res);
  }

  @Get('stream-ticket')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Issue a short-lived ticket for the log-stream service' })
  @ApiResponse({ status: 200, description: 'Stream ticket issued', type: StreamTicketResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async streamTicket(@Req() req: RequestLike): Promise<StreamTicketResponseDto> {
    return this.authService.issueStreamTicket(req.user as never);
  }

  @Post('verify-email')
  @SkipCsrf()
  @ApiOperation({ summary: 'Verify user email with verification code' })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid verification code or email already verified' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or expired token' 
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(verifyEmailDto.token, verifyEmailDto.code);
  }

  @Post('forgot-password')
  @SkipCsrf()
  @ApiOperation({ summary: 'Request password reset - sends verification code to email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset code sent (or would be sent if user exists)',
    type: ForgotPasswordResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format'
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-password-reset')
  @SkipCsrf()
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({
    status: 200,
    description: 'Verification code verified successfully',
    type: VerifyPasswordResetResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification code (with remaining attempts count)'
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token'
  })
  @ApiResponse({
    status: 429,
    description: 'Maximum attempts exceeded - token invalidated'
  })
  async verifyPasswordReset(@Body() verifyPasswordResetDto: VerifyPasswordResetDto): Promise<VerifyPasswordResetResponseDto> {
    return this.authService.verifyPasswordReset(
      verifyPasswordResetDto.token,
      verifyPasswordResetDto.code
    );
  }

  @Post('reset-password')
  @SkipCsrf()
  @ApiOperation({ summary: 'Reset password with verified token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password or token not verified'
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token'
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password
    );
  }

}
