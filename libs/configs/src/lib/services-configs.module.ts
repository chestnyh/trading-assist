import { Module, Global } from '@nestjs/common';
import { ServicesConfigs } from './services-configs';

@Global()
@Module({
  providers: [
    {
      provide: ServicesConfigs,
      useFactory: async() => {
        return (new ServicesConfigs()).setUp();
      },
    },
  ],
  exports: [ServicesConfigs],
})
export class ServicesConfigsModule {}
