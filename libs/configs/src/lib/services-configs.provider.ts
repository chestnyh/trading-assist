import { Injectable } from '@nestjs/common';
import { ServicesConfigs } from './services-configs';

@Injectable()
export class ServicesConfigsProvider {
  private readonly configs: ServicesConfigs;

  constructor() {
    this.configs = new ServicesConfigs();
  }

  get(key: string): string {
    return this.configs.get(key);
  }

}
