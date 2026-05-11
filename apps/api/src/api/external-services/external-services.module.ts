import { Module } from '@nestjs/common';
import { ExternalServicesService } from './external-services.service';
import { ExternalServicesController } from './external-services.controller';

@Module({
  controllers: [ExternalServicesController],
  providers: [ExternalServicesService],
})
export class ExternalServicesModule {}
