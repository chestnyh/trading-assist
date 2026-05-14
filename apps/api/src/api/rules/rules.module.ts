import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { ModelsModule } from '@trading-bot/models';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ModelsModule, AuthModule],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
