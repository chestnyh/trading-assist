import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateUserRuleSettingDtoSchemaValidator, Validate } from '@trading-bot/api-validator';
import { CreateUserRuleSettingDto } from './create-user-rule-setting.dto';

@Validate(UpdateUserRuleSettingDtoSchemaValidator)
export class UpdateUserRuleSettingDto extends PartialType(CreateUserRuleSettingDto) {
}