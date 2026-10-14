import { TempWorkspace } from '../testing/temp-workspace';
import { DevopsConfigs } from '../index';

const workspace = new TempWorkspace();

jest.mock('./workspace-root', () => ({ findWorkspaceRoot: () => workspace.root }));

describe('DevopsConfigs', () => {
  afterAll(() => {
    workspace.remove();
  });

  it('reads deployment settings from .env.devops', async () => {
    workspace.writeEnvFile('.env.devops', {
      AWS_ECR_REGION: 'eu-central-1',
      AWS_EC2_SSH_PORT: '22',
      DB_MIGRATION_USER: 'migrator',
    });

    const configs = await new DevopsConfigs().setUp();

    expect(configs.get('AWS_ECR_REGION')).toBe('eu-central-1');
    expect(configs.required.getNumber('AWS_EC2_SSH_PORT')).toBe(22);
    expect(configs.get('DB_MIGRATION_USER')).toBe('migrator');
  });

  it('does not read .env.dev', async () => {
    workspace.writeEnvFile('.env.devops', {});
    workspace.writeEnvFile('.env.dev', { DB_USER: 'dev_user' });

    const configs = await new DevopsConfigs().setUp();

    expect(configs.get('DB_USER')).toBeUndefined();
  });
});
