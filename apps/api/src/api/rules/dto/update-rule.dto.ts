import { PartialType } from '@nestjs/swagger';
import { UpdateRuleDtoSchemaValidator } from '@trading-assist/api-validator';
import { Validate } from '@trading-assist/api-validator/nest';
import { CreateRuleDto } from './create-rule.dto';

@Validate(UpdateRuleDtoSchemaValidator)
export class UpdateRuleDto extends PartialType(CreateRuleDto) {}
