import { ApiProperty } from '@nestjs/swagger';
import { ForgotPasswordDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(ForgotPasswordDtoSchemaValidator)
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;
}

