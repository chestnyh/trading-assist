import { ApiProperty } from '@nestjs/swagger';

export class RuleSettingResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'BTC Price Alert' })
  name: string;

  @ApiProperty({ example: 'BTC_ALERT_01' })
  code: string;

  @ApiProperty({ example: 'Sends a Telegram alert when BTC price drops below $50,000' })
  description: string;

  @ApiProperty({
    example: {
      type: 'log',
      arguments: { message: 'This message will be logged' }
    }
  })
  configuration: any;

  @ApiProperty({ example: 1 })
  authorId: number;

  @ApiProperty({ example: 1 })
  externalServiceId: number;

  @ApiProperty({ example: ['crypto', 'binance'] })
  tags?: string[];
}