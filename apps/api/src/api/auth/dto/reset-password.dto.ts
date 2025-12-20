import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User new password (must be at least 8 characters, contain uppercase, lowercase, number, and special character)',
    example: 'NewPassword123!',
    minLength: 8
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/.*[A-Z].*/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/.*[a-z].*/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/.*\d.*/, { message: 'Password must contain at least one number' })
  @Matches(/.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/, { message: 'Password must contain at least one special character' })
  password: string;

  @ApiProperty({
    description: 'Password reset token received from forgot-password endpoint',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}

