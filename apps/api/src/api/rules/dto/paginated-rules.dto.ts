import { ApiProperty } from '@nestjs/swagger';
import { RuleResponseDto } from './rule-response.dto';

export class PaginatedRulesDto {
  @ApiProperty({
    type: [RuleResponseDto],
    description: 'Array of rules for the requested page'
  })
  rules: RuleResponseDto[];

  @ApiProperty({
    example: 120,
    description: 'Total number of rules available'
  })
  total: number;
}
