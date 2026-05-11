import { ApiProperty } from '@nestjs/swagger';
import { LoginDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(LoginDtoSchemaValidator)
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'somepassword',
    minLength: 6
  })
  password: string;

  @ApiProperty({
    description: 'Remember me option to stay logged in',
    example: false,
    required: false
  })
  rememberMe?: boolean;
}
