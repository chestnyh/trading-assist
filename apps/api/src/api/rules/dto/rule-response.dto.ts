import { ApiProperty } from '@nestjs/swagger';

export class RuleResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the rule',
    example: 1
  })
  id: number;

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

  @ApiProperty({
    description: 'ID of the user who created this rule',
    example: 1
  })
  authorId: number;
  
}
