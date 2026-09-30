import { Provider } from '@nestjs/common';
import { ServicesConfigs } from './services-configs';

/**
 * NestJS provider that creates a single, fully loaded `ServicesConfigs` instance.
 * Nest waits for `setUp()` to finish before injecting it anywhere.
 */
export const servicesConfigsProvider: Provider = {
  provide: ServicesConfigs,
  useFactory: () => new ServicesConfigs().setUp(),
};
