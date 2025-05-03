import { DynamicModule, Module } from '@nestjs/common';

import { ModelsService } from './models.service';
import type { ConnectionParams } from '../types';

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
}

