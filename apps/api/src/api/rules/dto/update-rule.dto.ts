import { PartialType } from '@nestjs/swagger';
import { UpdateRuleDtoSchemaValidator, Validate } from '@trading-bot/api-validator';
import { CreateRuleDto } from './create-rule.dto';

@Validate(UpdateRuleDtoSchemaValidator)
export class UpdateRuleDto extends PartialType(CreateRuleDto) {}
