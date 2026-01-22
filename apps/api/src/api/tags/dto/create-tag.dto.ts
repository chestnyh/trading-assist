import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'Production' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}