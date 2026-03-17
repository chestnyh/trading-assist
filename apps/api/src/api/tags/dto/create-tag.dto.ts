import { ApiProperty } from '@nestjs/swagger';
import { CreateTagDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(CreateTagDtoSchemaValidator)
export class CreateTagDto {
  @ApiProperty({ example: 'Production' })
  name: string;
}