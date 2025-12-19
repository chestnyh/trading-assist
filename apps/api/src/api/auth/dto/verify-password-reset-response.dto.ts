import { ApiProperty } from '@nestjs/swagger';

export class VerifyPasswordResetResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Verification code verified successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Indicates if verification was successful',
    example: true
  })
  success: boolean;
}

