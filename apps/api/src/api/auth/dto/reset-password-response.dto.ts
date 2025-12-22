import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password has been reset successfully. Please sign in with your new password.'
  })
  message: string;

  @ApiProperty({
    description: 'Indicates if password reset was successful',
    example: true
  })
  success: boolean;
}

