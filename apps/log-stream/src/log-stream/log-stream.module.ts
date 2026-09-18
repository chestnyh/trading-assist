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
        environment: cfg.get('NODE_ENV'),
        enableConsole: cfg.getBoolean('LOG_ENABLE_CONSOLE'),
        enableElasticsearch: cfg.getBoolean('LOG_ENABLE_ELASTICSEARCH'),
        elasticsearch:
          cfg.get('LOG_ELASTICSEARCH_NODE') && cfg.get('LOG_ELASTICSEARCH_INDEX')
            ? {
                node: cfg.get('LOG_ELASTICSEARCH_NODE'),
                index: cfg.get('LOG_ELASTICSEARCH_INDEX'),
                auth: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')
                  ? { header: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER') }
                  : cfg.get('LOG_ELASTICSEARCH_API_KEY')
                    ? { apiKey: cfg.get('LOG_ELASTICSEARCH_API_KEY') }
                    : cfg.get('LOG_ELASTICSEARCH_USERNAME') && cfg.get('LOG_ELASTICSEARCH_PASSWORD')
                      ? {
                          username: cfg.get('LOG_ELASTICSEARCH_USERNAME'),
                          password: cfg.get('LOG_ELASTICSEARCH_PASSWORD'),
                        }
                      : undefined,
              }
            : undefined,
      }),
    }),
    ModelsModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        host: cfg.get('DB_HOST'),
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ServicesConfigsModule],
      useFactory: (cfg: ServicesConfigs) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: {
          expiresIn: cfg.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ServicesConfigs],
    }),
  ],
  controllers: [StreamController],
  providers: [JwtStrategy, RuleLogStreamService],
})
export class LogStreamModule {}
