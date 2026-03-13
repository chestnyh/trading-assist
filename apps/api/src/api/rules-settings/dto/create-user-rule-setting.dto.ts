import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRuleSettingDtoSchemaValidator, Validate } from '@trading-bot/api-validator';

@Validate(CreateUserRuleSettingDtoSchemaValidator)
export class CreateUserRuleSettingDto {
  @ApiProperty({ example: 'My Binance Bot' })
  name: string;

  @ApiProperty({ example: 'BINANCE_MAIN_01' })
  code: string;

  @ApiProperty({ example: 'Rule for spot trading', required: false })
  description?: string;

  @ApiProperty({ example: 1 })
  externalServiceId: number;

  @ApiProperty({ example: ['crypto', 'binance'], required: false })
  tags?: string[];

  @ApiProperty({
    example: { ApiKey: '...', ApiSecret: '...', BaseUrl: '...' }
  })
  configuration: Record<string, any>;
}