import { ApiProperty } from '@nestjs/swagger';
import { VerifyPasswordResetDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(VerifyPasswordResetDtoSchemaValidator)
export class VerifyPasswordResetDto {
  @ApiProperty({
    description: '6-digit verification code sent to user email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  code: string;

  @ApiProperty({
    description: 'Password reset token received from forgot-password endpoint',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  token: string;
}

