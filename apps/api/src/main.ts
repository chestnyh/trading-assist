/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerConfig } from './swagger.config'
import { ApiModule } from './api/api.module';
import { ServicesConfigs } from '@trading-bot/configs';
import { SchemaValidationPipe } from '@trading-bot/api-validator';
const configs = new ServicesConfigs();

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:4200', // Angular dev server
      'http://localhost:3000', // React dev server
      'http://localhost:5173', // Vite dev server
      'http://localhost:8080', // Vue dev server
      // Add production URLs here when deploying
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(new SchemaValidationPipe());

  const config = createSwaggerConfig();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const port = configs.get('API_PORT');
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
