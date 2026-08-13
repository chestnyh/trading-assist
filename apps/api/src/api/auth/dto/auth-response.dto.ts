import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      nickname: 'johndoe123',
      email: 'user@example.com',
      name: 'John Doe',
      country: 'UA',
    }
  })
  user: {
    id: number;
    nickname: string;
    email: string;
    name?: string;
    country?: string;
  };
}
