/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@trading-bot/logger';

import { AutoTraderModule } from './auto-trader/auto-trader.module';

async function bootstrap() {
  const app = await NestFactory.create(AutoTraderModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));
  await app.init();

  app.get(LoggerService).log('🚀 Application is running');
}

bootstrap();
