import { ApiProperty } from '@nestjs/swagger';
import { CreateRuleDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(CreateRuleDtoSchemaValidator)
export class CreateRuleDto {
  @ApiProperty({
    description: 'Name of the trading rule',
    example: 'BTC Price Alert'
  })
  name: string;

  @ApiProperty({
    description: 'Description of what this rule does',
    example: 'Sends a Telegram alert when BTC price drops below $50,000'
  })
  description: string;

  @ApiProperty({
    description: 'Rule configuration as JSON object',
    example: {
      type: 'log',
      arguments: {
        message: 'This message will be logged'
      }
    }
  })
  ruleBody: any;
}
