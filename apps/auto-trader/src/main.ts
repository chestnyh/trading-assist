/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AutoTraderModule } from './auto-trader/auto-trader.module';

async function bootstrap() {
  const app = await NestFactory.create(AutoTraderModule);
  Logger.log(
    `🚀 Application is running `
  );
}

bootstrap();
