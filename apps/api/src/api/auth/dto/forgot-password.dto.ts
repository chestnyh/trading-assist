import { ApiProperty } from '@nestjs/swagger';
import { ForgotPasswordDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(ForgotPasswordDtoSchemaValidator)
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;
}

