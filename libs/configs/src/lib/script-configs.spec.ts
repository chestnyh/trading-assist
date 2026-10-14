import { TempWorkspace } from '../testing/temp-workspace';
import { ScriptConfigs } from '../index';

const workspace = new TempWorkspace();

jest.mock('./workspace-root', () => ({ findWorkspaceRoot: () => workspace.root }));

describe('ScriptConfigs', () => {
  afterAll(() => {
    workspace.remove();
  });

  it('reads Docker settings from .env.dev', async () => {
    workspace.writeEnvFile('.env.dev', {
      DOCKER_PROJECT_NAME: 'trading_assist_dev',
      DOCKER_DB_VOLUME: './docker/volumes/local_db',
      DOCKER_PROFILE: 'development',
    });

    const configs = await new ScriptConfigs().setUp();

    expect(configs.get('DOCKER_PROJECT_NAME')).toBe('trading_assist_dev');
    expect(configs.get('DOCKER_DB_VOLUME')).toBe('./docker/volumes/local_db');
    expect(configs.required.get('DOCKER_PROFILE')).toBe('development');
  });

  it.each([undefined, ''])('defaults DOCKER_PROFILE to "external" when it is %p', async (profile) => {
    workspace.writeEnvFile('.env.dev', {
      DOCKER_PROJECT_NAME: 'trading_assist_dev',
      ...(profile === undefined ? {} : { DOCKER_PROFILE: profile }),
    });

    const configs = await new ScriptConfigs().setUp();

    expect(configs.get('DOCKER_PROFILE')).toBe('external');
  });
});
