import { ApiProperty } from '@nestjs/swagger';

export class StreamTicketResponseDto {
  @ApiProperty({
    description: 'Short-lived, narrowly-scoped JWT accepted only by the log-stream service',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  ticket: string;

  @ApiProperty({ description: 'Ticket lifetime in seconds', example: 60 })
  expiresIn: number;
}
