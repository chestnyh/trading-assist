import { Module } from '@nestjs/common';

import { ActionsRunnerModule } from '../actions-runner/actions-runner.module';

import { AutoTraderService } from './auto-trader.service';

import { ModelsModule, ConnectionParams } from '@trading-bot/models';

// const config: ConnectionParams = {}

@Module({
  imports: [
    ModelsModule.forRoot({
      host: 'localhost',
      port: 5432,
      user: 'admin',
      password: 'secret',
      database: 'test_db',
    }),
    ActionsRunnerModule,
  ],
  controllers: [],
  providers: [
    AutoTraderService,
  ],
})
export class AutoTraderModule {}
