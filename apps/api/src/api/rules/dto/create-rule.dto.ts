import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsObject } from 'class-validator';
import { CreateRuleDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

@Validate(CreateRuleDtoSchemaValidator)
export class CreateRuleDto {
  @ApiProperty({
    description: 'Name of the trading rule',
    example: 'BTC Price Alert'
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description: 'Description of what this rule does',
    example: 'Sends a Telegram alert when BTC price drops below $50,000'
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
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
  @IsObject({ message: 'Rule body must be a valid JSON object' })
  @IsNotEmpty({ message: 'Rule body is required' })
  ruleBody: any;
}
