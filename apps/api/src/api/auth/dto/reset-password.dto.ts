import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
    minLength: 8
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  )
  password: string;

  @ApiProperty({
    description: 'Password reset token received from forgot-password endpoint',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  @IsUUID(4, { message: 'Token must be a valid UUID' })
  token: string;
}

