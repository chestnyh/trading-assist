import { Module } from '@nestjs/common';
import { ModelsModule } from '@trading-bot/models';
import { RulesSettingsTagsController } from './tags.controller';
import { RuleSettingsTagsService } from './tags.service';

@Module({
  imports: [ModelsModule],
  controllers: [RulesSettingsTagsController],
  providers: [RuleSettingsTagsService],
  exports: [RuleSettingsTagsService],
})
export class RulesSettingsTagsModule {}