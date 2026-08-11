import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRuleSettingDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';
import { ServiceCode } from '@trading-bot/models';
@Validate(CreateUserRuleSettingDtoSchemaValidator)
export class CreateUserRuleSettingDto {
  @ApiProperty({ example: 'My Binance Bot' })
  name: string;

  @ApiProperty({ example: 'BINANCE_MAIN_01' })
  code: string;

  @ApiProperty({ example: 'Rule for spot trading', required: false })
  description?: string;

  @ApiProperty({enum: ServiceCode,enumName: 'ServiceCode',example: ServiceCode.TELEGRAM,})
  serviceCode: ServiceCode;

  @ApiProperty({ example: ['crypto', 'binance'], required: false })
  tags?: string[];

  @ApiProperty({
    example: { ApiKey: '...', ApiSecret: '...', BaseUrl: '...' }
  })
  configuration: Record<string, any>;
}