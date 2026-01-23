/**
 * Script to generate OpenAPI JSON file from NestJS application
 * This creates the OpenAPI spec without starting the HTTP server
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { ApiModule } from '../../../apps/api/src/api/api.module';
import { createSwaggerConfig } from '../../../apps/api/src/swagger.config';

async function generateOpenApi() {
  // Set mock environment variables to avoid DB connection requirements
  // These are only needed for module initialization, not actual DB connection
  process.env['DB_HOST'] = 'mock';
  process.env['DB_PORT'] = '5432';
  process.env['DB_USER'] = 'mock_user';
  process.env['DB_PASSWORD'] = 'mock_password';
  process.env['DB_NAME'] = 'mock_db';
  process.env['JWT_SECRET'] = 'mock_jwt_secret';
  process.env['JWT_EXPIRES_IN'] = '1h';

  // Create the NestJS application
  // Note: DB connection will be attempted during module initialization but will fail with mock values
  // This is OK - SwaggerModule.createDocument only needs the module structure, not a working DB
  // The connection error in onModuleInit won't prevent spec generation
  const app = await NestFactory.create(ApiModule, {
    logger: false, // Suppress logs during generation
  });

  // Set global prefix (same as in main.ts)
  app.setGlobalPrefix('api/v1');

  const config = createSwaggerConfig();

  // Generate the OpenAPI document
  const document = SwaggerModule.createDocument(app, config);

  // Determine output path (relative to this script location)
  const outputPath = join(__dirname, '../openapi.json');

  // Write to file
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`✅ OpenAPI spec generated: ${outputPath}`);

  // Close the app
  await app.close();
}

generateOpenApi().catch((error) => {
  console.error('Error generating OpenAPI spec:', error);
  process.exit(1);
});
