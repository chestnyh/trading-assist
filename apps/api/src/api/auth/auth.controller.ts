import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { VerifyPasswordResetDto } from './dto/verify-password-reset.dto';
import { VerifyPasswordResetResponseDto } from './dto/verify-password-reset-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { UsersApiService } from '../users/users.api.service';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersApiService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
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
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
      
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email address before logging in. Check your email for the verification code.');
    }

    return this.authService.login(user, loginDto.rememberMe);
  }

  @Post('verify-email')
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
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset code sent (or same message if user not found for security)',
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
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({ 
    status: 200, 
    description: 'Verification code verified successfully',
    type: VerifyPasswordResetResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid or expired verification code' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or expired token' 
  })
  async verifyPasswordReset(@Body() verifyPasswordResetDto: VerifyPasswordResetDto): Promise<VerifyPasswordResetResponseDto> {
    return this.authService.verifyPasswordReset(verifyPasswordResetDto.token, verifyPasswordResetDto.code);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid password or token already used' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or expired token' 
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }

}
