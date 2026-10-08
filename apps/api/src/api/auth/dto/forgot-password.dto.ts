import { ApiProperty } from '@nestjs/swagger';
import { ForgotPasswordDtoSchemaValidator } from '@trading-assist/api-validator';
import { Validate } from '@trading-assist/api-validator/nest';

@Validate(ForgotPasswordDtoSchemaValidator)
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;
}

