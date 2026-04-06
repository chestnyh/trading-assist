import { Injectable } from '@nestjs/common';
import { ServicesConfigs } from './services-configs';

@Injectable()
export class ServicesConfigsProvider {
  private readonly configs: ServicesConfigs;

  constructor() {
    this.configs = new ServicesConfigs();
  }

  get(key: string): string | boolean | undefined {
    return this.configs.get(key);
  }

}
