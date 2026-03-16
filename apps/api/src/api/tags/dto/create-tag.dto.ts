import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTagDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(CreateTagDtoSchemaValidator)
export class CreateTagDto {
  @ApiProperty({
    description: 'Name of the tag',
    example: 'Important'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}