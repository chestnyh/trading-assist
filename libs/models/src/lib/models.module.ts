import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { MODELS_OPTIONS } from './models.constants';
import { ModelsService } from './models.service';
import type { ModelsModuleAsyncOptions, ModelsModuleOptions } from './models.options';

@Global()
@Module({})
export class ModelsModule {
  static forRoot(options: ModelsModuleOptions): DynamicModule {
    const providers: Provider[] = [
      { provide: MODELS_OPTIONS, useValue: options },
      ModelsService,
    ];

    return {
      module: ModelsModule,
      providers,
      exports: [ModelsService],
    };
  }

  static forRootAsync(options: ModelsModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: MODELS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
      ModelsService,
    ];

    return {
      module: ModelsModule,
      providers,
      exports: [ModelsService],
    };
  }
}
