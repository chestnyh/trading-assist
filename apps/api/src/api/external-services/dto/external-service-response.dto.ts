import { ApiProperty } from '@nestjs/swagger';

export class ExternalServiceResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Binance' })
  name: string;

  @ApiProperty({ example: 'binance' })
  code: string;

  @ApiProperty({ type: String, example: '/logos/binance.svg', required: false, nullable: true })
  logoUrl: string | null;

  @ApiProperty({
    isArray: true,
    type: Object,
    example: [
      { key: "apiKey", label: "ApiKey", required: true, exactLength: 32, placeholder: "Insert api key…" }
    ]
  })
  fieldsSchema: any[];
}
