import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateUserRuleSettingDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';
import { CreateUserRuleSettingDto } from './create-user-rule-setting.dto';

@Validate(UpdateUserRuleSettingDtoSchemaValidator)
export class UpdateUserRuleSettingDto extends PartialType(CreateUserRuleSettingDto) {
}