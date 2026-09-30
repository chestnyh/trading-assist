import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ description: 'Always true; sign-out is idempotent', example: true })
  success: boolean;
}
