import { ApiProperty } from '@nestjs/swagger';
import { TradingExperienceLevel, PrimaryTradingStrategy, RiskTolerance, TradingPlatform } from '@trading-bot/models';
import { CreateUserDtoSchemaValidator } from '@trading-bot/api-validator';
import { Validate } from '@trading-bot/api-validator/nest';

export { TradingExperienceLevel, PrimaryTradingStrategy, RiskTolerance, TradingPlatform };

@Validate(CreateUserDtoSchemaValidator)
export class CreateUserDto {
  @ApiProperty({
    description: 'Unique nickname for the user',
    example: 'traderjoe'
  })
  nickname: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User password (must be at least 8 characters, contain uppercase, lowercase, number, and special character)',
    example: 'SecurePass123!',
    minLength: 8
  })
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({
    description: 'Trading experience level',
    example: 'Intermediate',
    enum: TradingExperienceLevel,
    enumName: 'TradingExperienceLevel',
    required: false
  })
  tradingExperienceLevel?: TradingExperienceLevel;

  @ApiProperty({
    description: 'Primary trading strategy',
    example: 'Day Trading',
    enum: PrimaryTradingStrategy,
    enumName: 'PrimaryTradingStrategy',
    required: false
  })
  primaryTradingStrategy?: PrimaryTradingStrategy;

  @ApiProperty({
    description: 'Risk tolerance level',
    example: 'Moderate',
    enum: RiskTolerance,
    enumName: 'RiskTolerance',
    required: false
  })
  riskTolerance?: RiskTolerance;

  @ApiProperty({
    description: 'Preferred trading platforms (multiple selection allowed)',
    example: ['Binance', 'Bybit'],
    enum: TradingPlatform,
    enumName: 'TradingPlatform',
    isArray: true,
    required: false
  })
  preferredTradingPlatforms?: TradingPlatform[];
}
