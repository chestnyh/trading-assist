# Trading Bot Configs Library

A NestJS-compatible configuration library for the trading bot system that provides centralized configuration management across all services.

## Features

- **NestJS Module Integration**: Proper dependency injection support
- **Environment-based Configuration**: Automatic environment file loading
- **Type Safety**: TypeScript support with proper typing
- **Global Module**: Available across the entire application
- **JWT Configuration**: Built-in JWT secret and expiration settings

## Usage

### 1. Import the Module

In any NestJS module where you need configuration:

```typescript
import { Module } from '@nestjs/common';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';

@Module({
  imports: [ServicesConfigsModule],
  // ... other module configuration
})
export class YourModule {}
```

### 2. Inject ServicesConfigs

In your service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { ServicesConfigs } from '@trading-bot/configs';

@Injectable()
export class YourService {
  constructor(private configService: ServicesConfigs) {}

  someMethod() {
    // Get configuration values
    const dbHost = this.configService.get('DB_HOST');
    const jwtSecret = this.configService.get('JWT_SECRET');
    const port = this.configService.get('PORT');
  }
}
```

### 3. Available Configuration Keys

The following configuration keys are available:

- `PORT`: Application port (default: '3000')
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: '5432')
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: JWT secret key (default: 'your-secret-key')
- `JWT_EXPIRES_IN`: JWT expiration time (default: '24h')

### 4. Environment File Loading

The module automatically loads environment files based on `NODE_ENV`:

- **Development**: `.env.dev`
- **API Integration Tests**: `.env.api-int-tests`
- **Production**: Uses system environment variables

### 5. Example Service Implementation

```typescript
import { Injectable } from '@nestjs/common';
import { ServicesConfigs } from '@trading-bot/configs';

@Injectable()
export class DatabaseService {
  constructor(private configService: ServicesConfigs) {}

  getConnectionString(): string {
    const host = this.configService.get('DB_HOST');
    const port = this.configService.get('DB_PORT');
    const user = this.configService.get('DB_USER');
    const password = this.configService.get('DB_PASSWORD');
    const database = this.configService.get('DB_NAME');
    
    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  getJwtConfig() {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    };
  }
}
```

### 6. JWT Module Integration

For JWT configuration in your modules:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ServicesConfigsModule, ServicesConfigs } from '@trading-bot/configs';

@Module({
  imports: [
    ServicesConfigsModule,
    JwtModule.registerAsync({
      imports: [ServicesConfigsModule],
      useFactory: async (configService: ServicesConfigs) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ServicesConfigs],
    }),
  ],
  // ... rest of module
})
export class YourAuthModule {}
```

## Architecture

### ServicesConfigsModule

The main NestJS module that provides the configuration service:

- **Global Module**: Available throughout the application
- **Singleton**: Single instance across the application
- **Factory Pattern**: Creates ServicesConfigs instance on demand

### ServicesConfigs Class

The core configuration class that:

- Loads environment variables
- Provides getter methods for configuration values
- Handles different environments (dev, test, production)

### ServicesConfigsProvider

An alternative provider that wraps the ServicesConfigs class for more complex scenarios.

## Environment Variables

Create appropriate environment files:

### .env.dev
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### .env.api-int-tests
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=test_db
JWT_SECRET=test-jwt-secret
JWT_EXPIRES_IN=1h
```

## Best Practices

1. **Always use dependency injection** instead of creating new instances
2. **Use the global module** to avoid importing in every module
3. **Validate configuration** in your application startup
4. **Use environment-specific files** for different deployment environments
5. **Keep secrets secure** and never commit them to version control

## Migration from Direct Usage

If you were previously using ServicesConfigs directly:

**Before:**
```typescript
import { ServicesConfigs } from '@trading-bot/configs';

const config = new ServicesConfigs();
const value = config.get('SOME_KEY');
```

**After:**
```typescript
import { Injectable } from '@nestjs/common';
import { ServicesConfigs } from '@trading-bot/configs';

@Injectable()
export class YourService {
  constructor(private configService: ServicesConfigs) {}
  
  someMethod() {
    const value = this.configService.get('SOME_KEY');
  }
}
```

This approach provides better testability, dependency management, and follows NestJS best practices.