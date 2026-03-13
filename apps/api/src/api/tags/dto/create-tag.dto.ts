import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTagDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(CreateTagDtoSchemaValidator)
export class CreateTagDto {
  @ApiProperty({ example: 'Production' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}