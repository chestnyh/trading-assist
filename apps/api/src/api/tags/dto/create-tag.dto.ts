import { ApiProperty } from '@nestjs/swagger';
import { CreateTagDtoSchemaValidator } from '@trading-assist/api-validator';
import { Validate } from '@trading-assist/api-validator/nest';

@Validate(CreateTagDtoSchemaValidator)
export class CreateTagDto {
  @ApiProperty({ example: 'Production' })
  name: string;
}