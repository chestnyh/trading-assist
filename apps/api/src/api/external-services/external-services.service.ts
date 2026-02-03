import { Injectable } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';

@Injectable()
export class ExternalServicesService {
  constructor(private readonly modelsService: ModelsService) {}

  async findAll() {
    return this.modelsService.externalServices.findMany();
  }
}
