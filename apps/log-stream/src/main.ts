import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@trading-bot/logger';
import { ServicesConfigs } from '@trading-bot/configs';

import { LogStreamModule } from './log-stream/log-stream.module';

async function bootstrap() {
  const app = await NestFactory.create(LogStreamModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
    ],
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const port = app.get(ServicesConfigs).get('LOG_STREAM_PORT') ?? 3002;
  await app.listen(port as string | number);

  app.get(LoggerService).log(`🚀 log-stream is running on port ${port}`);
}

bootstrap();
