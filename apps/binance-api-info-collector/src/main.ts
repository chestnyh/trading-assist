/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { CollectorModule } from './collector/collector.module';

const SERVICE_NAME = 'binance-api-info-collector'

async function bootstrap() {
  await NestFactory.create(CollectorModule);
  Logger.log(
    `🚀 Application ${SERVICE_NAME} is running.`
  );
}

bootstrap();
