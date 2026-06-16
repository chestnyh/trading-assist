import { DynamicModule, Module, Global } from '@nestjs/common';

import { ModelsService } from './models.service';

@Global()
@Module({})
export class ModelsModule {
  static forRoot(): DynamicModule {
    return {
      module: ModelsModule,
      providers: [ModelsService],
      exports: [ModelsService],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: ModelsModule,
      providers: [ModelsService],
      exports: [ModelsService],
    };
  }
}

