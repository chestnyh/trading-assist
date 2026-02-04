import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsObject, IsInt, IsOptional } from 'class-validator';

export class CreateUserRuleSettingDto {
  @ApiProperty({ example: 'My Binance Bot' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'BINANCE_MAIN_01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Rule for spot trading', required: false })
  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  externalServiceId: number;

  @ApiProperty({ example: ['crypto', 'binance'], required: false })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: { ApiKey: '...', ApiSecret: '...', BaseUrl: '...' }
  })
  @IsObject()
  @IsNotEmpty()
  configuration: Record<string, any>;
}