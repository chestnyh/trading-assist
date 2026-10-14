import { Inject, Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { TempWorkspace } from '../testing/temp-workspace';
import { ServicesConfigs, ServicesConfigsModule } from '../index';

const workspace = new TempWorkspace();

jest.mock('./workspace-root', () => ({ findWorkspaceRoot: () => workspace.root }));

/** A service from another module that only declares the dependency, like the apps do. */
@Injectable()
class ConsumerService {
  constructor(@Inject(ServicesConfigs) readonly configs: ServicesConfigs) {}
}

@Module({ providers: [ConsumerService] })
class ConsumerModule {}

describe('ServicesConfigsModule', () => {
  const originalEnv = process.env;

  const compile = () =>
    Test.createTestingModule({ imports: [ServicesConfigsModule, ConsumerModule] }).compile();

  beforeEach(() => {
    process.env = { ...originalEnv, NODE_ENV: 'production' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  afterAll(() => {
    workspace.remove();
  });

  it('injects a loaded ServicesConfigs into other modules without importing it there', async () => {
    process.env['JWT_SECRET'] = 'secret';

    const app = await compile();
    const { configs } = app.get(ConsumerService);

    expect(configs).toBeInstanceOf(ServicesConfigs);
    expect(configs.required.get('JWT_SECRET')).toBe('secret');
  });

  it('shares one instance across the app', async () => {
    const app = await compile();

    expect(app.get(ConsumerService).configs).toBe(app.get(ServicesConfigs));
  });

  it('fails to start when the configuration cannot be loaded', async () => {
    process.env['NODE_ENV'] = 'development';
    workspace.removeEnvFile('.env.dev');

    await expect(compile()).rejects.toThrow(/ENOENT/);
  });
});
