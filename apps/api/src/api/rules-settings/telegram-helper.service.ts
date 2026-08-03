import { Injectable, RequestTimeoutException, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramHelperService {
  private readonly logger = new Logger(TelegramHelperService.name);
  async getChatIdViaPolling(botToken: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const bot = new TelegramBot(botToken, { polling: true });

      const timer = setTimeout(() => {
        bot.stopPolling();
        reject(new RequestTimeoutException('Time expired. Message not received.'));
      }, 120000);

      bot.on('message', async (msg) => {
        const chatId = msg.chat.id;

        clearTimeout(timer);
        bot.stopPolling();

        try {
          await bot.sendMessage(chatId, `Your Chat ID : ${chatId}. Go back to the trading assistant.`);
        } catch (e) {
          this.logger.error('Error sending confirmation to Telegram:', e);
        }

        resolve(chatId);
      });

      bot.on('polling_error', (error) => {
        bot.stopPolling();
        clearTimeout(timer);
        reject(new Error(`Telegram polling error: ${error.message}`));
      });
    });
  }
}