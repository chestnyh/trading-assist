import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserRuleSettingDto } from './create-user-rule-setting.dto';

export class UpdateUserRuleSettingDto extends PartialType(CreateUserRuleSettingDto) {
}