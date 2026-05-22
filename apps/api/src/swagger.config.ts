import { DocumentBuilder } from '@nestjs/swagger';

export const createSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Trading Bot API')
    .setDescription('API for trading bot user management and authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('rules-settings', 'Endpoints for managing individual user trading rule configurations')
    .addTag('tags', 'Endpoints for managing tags associated with trading rules')
    .build();
};

