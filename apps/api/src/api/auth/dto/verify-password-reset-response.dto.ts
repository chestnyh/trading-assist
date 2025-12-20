import { ApiProperty } from '@nestjs/swagger';

export class VerifyPasswordResetResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Verification code verified successfully'
  })
  message: string;
}

