import { Module } from '@nestjs/common';
import { ModelsModule } from '@trading-bot/models';
import { RulesSettingsController } from './rules-settings.controller';
import { RulesSettingsService } from './rules-settings.service';
import { TelegramHelperService } from './telegram-helper.service';
import { TelegramChatIdController } from './telegram-chat-id.controller';

@Module({
  imports: [ModelsModule],
  controllers: [RulesSettingsController, TelegramChatIdController],
  providers: [RulesSettingsService, TelegramHelperService],
  exports: [RulesSettingsService],
})
export class RulesSettingsModule {}