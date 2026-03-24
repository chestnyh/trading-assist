import { Module } from '@nestjs/common';
import { ModelsModule } from '@trading-bot/models';
import { RulesSettingsController } from './rules-settings.controller';
import { RulesSettingsService } from './rules-settings.service';
import { TelegramHelperService } from './telegram-helper.service';

@Module({
  imports: [ModelsModule],
  controllers: [RulesSettingsController],
  providers: [RulesSettingsService, TelegramHelperService],
  exports: [RulesSettingsService],
})
export class RulesSettingsModule {}