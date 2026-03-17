import { ApiProperty } from '@nestjs/swagger';
import { ResetPasswordDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(ResetPasswordDtoSchemaValidator)
export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
    minLength: 8
  })
  password: string;

  @ApiProperty({
    description: 'Password reset token received from forgot-password endpoint',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  token: string;
}

