import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ description: 'User identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Unique nickname', example: 'johndoe123' })
  nickname: string;

  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'User role', example: 'USER', enum: ['ADMIN', 'USER'] })
  role: string;

  @ApiProperty({ description: 'Country code', example: 'UA', required: false })
  country?: string;
}
