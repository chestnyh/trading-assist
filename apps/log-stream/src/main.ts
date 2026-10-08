import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@trading-assist/logger';
import { ServicesConfigs } from '@trading-assist/configs';

import { LogStreamModule } from './log-stream/log-stream.module';

async function bootstrap() {
  const configs = await (new ServicesConfigs()).setUp();
  const app = await NestFactory.create(LogStreamModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));
  
  app.enableCors({
    origin: [
      configs.get('UCP_URL')
    ],
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const port = app.get(ServicesConfigs).get('LOG_STREAM_PORT') ?? 3002;
  await app.listen(port);

  app.get(LoggerService).log(`🚀 log-stream is running on port ${port}`);
}

bootstrap();
