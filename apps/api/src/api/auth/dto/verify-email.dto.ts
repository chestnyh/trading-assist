import { ApiProperty } from '@nestjs/swagger';
import { VerifyEmailDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(VerifyEmailDtoSchemaValidator)
export class VerifyEmailDto {
  @ApiProperty({
    description: '6-digit verification code sent to user email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  code: string;

  @ApiProperty({
    description: 'Registration token received from user registration',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  token: string;
}

