import { ApiProperty } from '@nestjs/swagger';
import { CreateTagDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(CreateTagDtoSchemaValidator)
export class CreateTagDto {
  @ApiProperty({ example: 'Production' })
  name: string;
}