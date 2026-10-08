/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { createSwaggerConfig } from './swagger.config'
import { ApiModule } from './api/api.module';
import { ServicesConfigs } from '@trading-assist/configs';
import { SchemaValidationPipe } from '@trading-assist/api-validator/nest';
import { LoggerService } from '@trading-assist/logger';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });
  const configs = await (new ServicesConfigs()).setUp();
  app.useLogger(app.get(LoggerService));

  app.use(cookieParser());

  app.enableCors({
    origin: [
      configs.get('UCP_URL'),
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-CSRF-Token'],
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(new SchemaValidationPipe());

  const swaggerConfig = createSwaggerConfig();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const port = configs.get('API_PORT');
  await app.listen(port);

  app
    .get(LoggerService)
    .log(`🚀 Application is running on port ${port}`);
}

bootstrap();
