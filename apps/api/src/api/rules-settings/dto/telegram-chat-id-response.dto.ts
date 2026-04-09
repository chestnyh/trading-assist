import { ApiProperty } from '@nestjs/swagger';

export class TelegramChatIdResponseDto {
  @ApiProperty({ example: 1234567890 })
  chatId: number;
}
