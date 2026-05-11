import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Password reset token required for subsequent steps',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  token: string;

  @ApiProperty({
    description: 'Success message',
    example: 'If an account with this email exists, a password reset code has been sent to your email.'
  })
  message: string;
}

