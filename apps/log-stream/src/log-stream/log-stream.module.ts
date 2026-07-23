import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ServicesConfigs, ServicesConfigsModule } from '@trading-bot/configs';
import { ModelsModule } from '@trading-bot/models';
import { LoggerModule } from '@trading-bot/logger';

import { JwtStrategy } from './auth/jwt.strategy';
import { RuleLogStreamService } from './rule-log-stream.service';
import { StreamController } from './stream.controller';

const config = new ServicesConfigs();

@Module({
  imports: [
    ServicesConfigsModule,
    LoggerModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        service: 'log-stream',
        environment: cfg.get('NODE_ENV') as string,
        enableConsole: cfg.get('LOG_ENABLE_CONSOLE') as boolean,
        enableElasticsearch: cfg.get('LOG_ENABLE_ELASTICSEARCH') as boolean,
        elasticsearch:
          cfg.get('LOG_ELASTICSEARCH_NODE') && cfg.get('LOG_ELASTICSEARCH_INDEX')
            ? {
                node: cfg.get('LOG_ELASTICSEARCH_NODE') as string,
                index: cfg.get('LOG_ELASTICSEARCH_INDEX') as string,
                auth: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')
                  ? { header: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER') as string }
                  : cfg.get('LOG_ELASTICSEARCH_API_KEY')
                    ? { apiKey: cfg.get('LOG_ELASTICSEARCH_API_KEY') as string }
                    : cfg.get('LOG_ELASTICSEARCH_USERNAME') && cfg.get('LOG_ELASTICSEARCH_PASSWORD')
                      ? {
                          username: cfg.get('LOG_ELASTICSEARCH_USERNAME') as string,
                          password: cfg.get('LOG_ELASTICSEARCH_PASSWORD') as string,
                        }
                      : undefined,
              }
            : undefined,
      }),
    }),
    ModelsModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        host: cfg.get('DB_HOST') as string,
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USER') as string,
        password: cfg.get('DB_PASSWORD') as string,
        database: cfg.get('DB_NAME') as string,
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ServicesConfigsModule],
      useFactory: (cfg: ServicesConfigs) => ({
        secret: cfg.get('JWT_SECRET') as string,
        signOptions: {
          expiresIn: cfg.get('JWT_EXPIRES_IN') as string,
        },
      }),
      inject: [ServicesConfigs],
    }),
  ],
  controllers: [StreamController],
  providers: [JwtStrategy, RuleLogStreamService],
})
export class LogStreamModule {}
