import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateUserRuleSettingDtoSchemaValidator } from '@trading-assist/api-validator';
import { Validate } from '@trading-assist/api-validator/nest';
import { CreateUserRuleSettingDto } from './create-user-rule-setting.dto';

@Validate(UpdateUserRuleSettingDtoSchemaValidator)
export class UpdateUserRuleSettingDto extends PartialType(CreateUserRuleSettingDto) {
}