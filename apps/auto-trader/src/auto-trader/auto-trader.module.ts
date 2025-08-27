import { Module } from '@nestjs/common';

import { AutoTraderService } from './auto-trader.service';

import { ModelsModule, ConnectionParams } from '@trading-bot/models';

import { ServicesConfigs } from '@trading-bot/configs';

const config = new ServicesConfigs();

@Module({
  imports: [
    ModelsModule.forRoot({
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      user: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
    }),
  ],
  controllers: [],
  providers: [
    AutoTraderService,
  ],
})
export class AutoTraderModule {}
