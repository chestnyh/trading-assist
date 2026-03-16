import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Length, IsUUID } from 'class-validator';
import { VerifyEmailDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(VerifyEmailDtoSchemaValidator)
export class VerifyEmailDto {
  @ApiProperty({
    description: '6-digit verification code sent to user email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString({ message: 'Verification code must be a string' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  @Matches(/^\d+$/, { message: 'Verification code must contain only numbers' })
  code: string;

  @ApiProperty({
    description: 'Registration token received from user registration',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  @IsUUID(4, { message: 'Token must be a valid UUID' })
  token: string;
}

