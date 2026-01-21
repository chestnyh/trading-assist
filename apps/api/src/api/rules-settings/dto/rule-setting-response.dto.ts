import { ApiProperty } from '@nestjs/swagger';

export class RuleSettingResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'BTC Price Alert' })
  name: string;

  @ApiProperty({ example: 'Sends a Telegram alert when BTC price drops below $50,000' })
  description: string;

  @ApiProperty({
    example: {
      type: 'log',
      arguments: { message: 'This message will be logged' }
    }
  })
  ruleBody: any;

  @ApiProperty({ example: 1 })
  authorId: number;
}