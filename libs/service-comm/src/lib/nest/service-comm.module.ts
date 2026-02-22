import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { SERVICE_COMM_OPTIONS } from './service-comm.constants';
import { ServiceCommService } from './service-comm.service';
import type { RmqConnectionOptions, RmqTopologyOptions } from '../rmq/types';

export interface ServiceCommModuleOptions {
  connection: RmqConnectionOptions;
  topology: RmqTopologyOptions;
}

export interface ServiceCommModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<ServiceCommModuleOptions> | ServiceCommModuleOptions;
  inject?: any[];
}

@Global()
@Module({})
export class ServiceCommModule {
  static forRoot(options: ServiceCommModuleOptions): DynamicModule {
    const providers: Provider[] = [
      { provide: SERVICE_COMM_OPTIONS, useValue: options },
      ServiceCommService,
    ];

    return {
      module: ServiceCommModule,
      providers,
      exports: [ServiceCommService],
    };
  }

  static forRootAsync(options: ServiceCommModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: SERVICE_COMM_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
      ServiceCommService,
    ];

    return {
      module: ServiceCommModule,
      providers,
      exports: [ServiceCommService],
    };
  }
}
