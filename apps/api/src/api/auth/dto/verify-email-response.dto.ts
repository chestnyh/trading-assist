import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Email verified successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Indicates if verification was successful',
    example: true
  })
  success: boolean;
}

