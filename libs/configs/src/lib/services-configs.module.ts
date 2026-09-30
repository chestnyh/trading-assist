import { Global, Module } from '@nestjs/common';
import { ServicesConfigs } from './services-configs';
import { servicesConfigsProvider } from './services-configs.provider';

@Global()
@Module({
  providers: [servicesConfigsProvider],
  exports: [ServicesConfigs],
})
export class ServicesConfigsModule {}
