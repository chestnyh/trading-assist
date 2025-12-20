import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class VerifyPasswordResetDto {
  @ApiProperty({
    description: '6-digit verification code sent to user email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString({ message: 'Verification code must be a string' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  @Matches(/^\d+$/, { message: 'Verification code must contain only numbers' })
  code: string;

  @ApiProperty({
    description: 'Password reset token received from forgot-password endpoint',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}

