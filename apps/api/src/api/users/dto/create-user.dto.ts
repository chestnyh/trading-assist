import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique nickname for the user',
    example: 'traderjoe'
  })
  @IsString({ message: 'Nickname must be a string' })
  @IsNotEmpty({ message: 'Nickname is required' })
  @MinLength(3, { message: 'Nickname must be at least 3 characters long' })
  nickname: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'somepassword',
    minLength: 6
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'Name must be a string' })
  @IsOptional({ message: 'Name is optional' })
  name?: string;
}