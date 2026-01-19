import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches, IsEmail, IsEnum, IsArray } from 'class-validator';
import { TradingExperienceLevel, PrimaryTradingStrategy, RiskTolerance, TradingPlatform } from '@prisma/client';

export { TradingExperienceLevel, PrimaryTradingStrategy, RiskTolerance, TradingPlatform };

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique nickname for the user',
    example: 'traderjoe'
  })
  @IsString({ message: 'Nickname must be a string' })
  @IsNotEmpty({ message: 'Nickname is required' })
  @MinLength(3, { message: 'Nickname must be at least 3 characters long' })
  nickname: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password (must be at least 8 characters, contain uppercase, lowercase, number, and special character)',
    example: 'SecurePass123!',
    minLength: 8
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(1, { message: 'First name must be at least 1 character long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(1, { message: 'Last name must be at least 1 character long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, { message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' })
  lastName: string;

  @ApiProperty({
    description: 'Trading experience level',
    example: 'Intermediate',
    enum: TradingExperienceLevel,
    enumName: 'TradingExperienceLevel',
    required: false
  })
  @IsOptional()
  @IsEnum(TradingExperienceLevel, { message: 'Trading experience level must be one of: Beginner, Intermediate, Advanced' })
  tradingExperienceLevel?: TradingExperienceLevel;

  @ApiProperty({
    description: 'Primary trading strategy',
    example: 'Day Trading',
    enum: PrimaryTradingStrategy,
    enumName: 'PrimaryTradingStrategy',
    required: false
  })
  @IsOptional()
  @IsEnum(PrimaryTradingStrategy, { message: 'Primary trading strategy must be one of: Scalping, DayTrading, SwingTrading, PositionTrading, Automated' })
  primaryTradingStrategy?: PrimaryTradingStrategy;

  @ApiProperty({
    description: 'Risk tolerance level',
    example: 'Moderate',
    enum: RiskTolerance,
    enumName: 'RiskTolerance',
    required: false
  })
  @IsOptional()
  @IsEnum(RiskTolerance, { message: 'Risk tolerance must be one of: Conservative, Moderate, Aggressive' })
  riskTolerance?: RiskTolerance;

  @ApiProperty({
    description: 'Preferred trading platforms (multiple selection allowed)',
    example: ['Binance', 'Bybit'],
    enum: TradingPlatform,
    enumName: 'TradingPlatform',
    isArray: true,
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'Preferred trading platforms must be an array' })
  @IsEnum(TradingPlatform, { each: true, message: 'Each platform must be one of: Binance, Bybit, Kraken, Other' })
  preferredTradingPlatforms?: TradingPlatform[];
}
