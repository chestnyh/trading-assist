import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Production' })
  name: string;

  @ApiProperty({ example: 1 })
  userId: number;
}