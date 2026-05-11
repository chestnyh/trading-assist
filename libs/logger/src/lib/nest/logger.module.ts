import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { LOGGER_OPTIONS } from './logger.constants';
import { LoggerService } from './logger.service';
import type { LoggerModuleAsyncOptions, LoggerModuleOptions } from '../types';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    const providers: Provider[] = [
      { provide: LOGGER_OPTIONS, useValue: options },
      LoggerService,
    ];

    return {
      module: LoggerModule,
      providers,
      exports: [LoggerService],
    };
  }

  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: LOGGER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
      LoggerService,
    ];

    return {
      module: LoggerModule,
      providers,
      exports: [LoggerService],
    };
  }
}
