import { Module, Global } from '@nestjs/common';
import { ServicesConfigs } from './services-configs';

@Global()
@Module({
  providers: [
    {
      provide: ServicesConfigs,
      useFactory: () => {
        return new ServicesConfigs();
      },
    },
  ],
  exports: [ServicesConfigs],
})
export class ServicesConfigsModule {}
