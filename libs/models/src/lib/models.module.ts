import { DynamicModule, Module, Global } from '@nestjs/common';

import { ModelsService } from './models.service';
import type { ConnectionParams } from '../types';

@Global()
@Module({})
export class ModelsModule {
  static forRoot(params: ConnectionParams): DynamicModule {
    return {
      module: ModelsModule,
      providers: [
        {
          provide: 'DB_PARAMS',
          useValue: params,
        },
        {
          provide: ModelsService,
          useFactory: (params: ConnectionParams) => new ModelsService(params),
          inject: ['DB_PARAMS'],
        },
      ],
      exports: [ModelsService],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<ConnectionParams> | ConnectionParams;
    inject?: any[];
  }): DynamicModule {
    return {
      module: ModelsModule,
      providers: [
        {
          provide: 'DB_PARAMS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: ModelsService,
          useFactory: (params: ConnectionParams) => new ModelsService(params),
          inject: ['DB_PARAMS'],
        },
      ],
      exports: [ModelsService],
    };
  }
}

