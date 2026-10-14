import { TempWorkspace } from '../testing/temp-workspace';
import { ServicesConfigs } from '../index';

const workspace = new TempWorkspace();

jest.mock('./workspace-root', () => ({ findWorkspaceRoot: () => workspace.root }));

describe('ServicesConfigs', () => {
  const originalEnv = process.env;

  const load = (nodeEnv: string | undefined) => {
    if (nodeEnv === undefined) {
      delete process.env['NODE_ENV'];
    } else {
      process.env['NODE_ENV'] = nodeEnv;
    }
    return new ServicesConfigs().setUp();
  };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  afterAll(() => {
    workspace.remove();
  });

  describe('in development', () => {
    it('reads values from .env.dev', async () => {
      workspace.writeEnvFile('.env.dev', { DB_HOST: 'localhost', DB_NAME: 'dev_db' });

      const configs = await load('development');

      expect(configs.get('DB_HOST')).toBe('localhost');
      expect(configs.get('DB_NAME')).toBe('dev_db');
    });

    it('expands ${VAR} references in the file', async () => {
      workspace.writeEnvFile('.env.dev', {
        API_HOST: 'http://localhost',
        API_PORT: '3001',
        API_BASE_URL: '${API_HOST}:${API_PORT}/api',
      });

      const configs = await load('development');

      expect(configs.get('API_BASE_URL')).toBe('http://localhost:3001/api');
    });

    it('prefers the file over process.env and leaves process.env untouched', async () => {
      process.env['DB_HOST'] = 'from-shell';
      workspace.writeEnvFile('.env.dev', { DB_HOST: 'from-file', DB_NAME: 'dev_db' });

      const configs = await load('development');

      expect(configs.get('DB_HOST')).toBe('from-file');
      expect(process.env['DB_HOST']).toBe('from-shell');
      expect(process.env['DB_NAME']).toBeUndefined();
    });

    it('fails to set up when .env.dev is missing', async () => {
      workspace.removeEnvFile('.env.dev');

      await expect(load('development')).rejects.toThrow(/ENOENT/);
    });
  });

  describe('in API integration tests', () => {
    it('reads values from .env.api-int-tests', async () => {
      workspace.writeEnvFile('.env.api-int-tests', { DB_NAME: 'int_tests_db' });

      const configs = await load('api-int-tests');

      expect(configs.get('DB_NAME')).toBe('int_tests_db');
    });
  });

  describe.each(['production', 'test', undefined])('with NODE_ENV=%p', (nodeEnv) => {
    it('reads values from process.env, not from env files', async () => {
      workspace.writeEnvFile('.env.dev', { DB_HOST: 'from-file' });
      process.env['DB_HOST'] = 'from-process';

      const configs = await load(nodeEnv);

      expect(configs.get('DB_HOST')).toBe('from-process');
    });
  });

  describe('reading values', () => {
    beforeEach(() => {
      process.env['NODE_ENV'] = 'production';
    });

    it('applies defaults for missing and empty values', async () => {
      delete process.env['API_PORT'];
      process.env['REDIS_HOST'] = '';

      const configs = await load('production');

      expect(configs.getNumber('API_PORT')).toBe(3001);
      expect(configs.get('REDIS_HOST')).toBe('localhost');
      expect(configs.getBoolean('AUTH_COOKIE_SECURE')).toBe(false);
      expect(configs.get('JWT_ACCESS_EXPIRES_IN')).toBe('15m');
    });

    it('parses numbers and booleans', async () => {
      process.env['RMQ_PORT'] = ' 5673 ';
      process.env['AUTH_COOKIE_SECURE'] = 'TRUE';
      process.env['LOG_ENABLE_CONSOLE'] = 'false';

      const configs = await load('production');

      expect(configs.getNumber('RMQ_PORT')).toBe(5673);
      expect(configs.getBoolean('AUTH_COOKIE_SECURE')).toBe(true);
      expect(configs.getBoolean('LOG_ENABLE_CONSOLE')).toBe(false);
    });

    it('returns undefined for values that are missing or cannot be parsed', async () => {
      delete process.env['JWT_SECRET'];
      process.env['DB_PORT'] = 'abc';
      process.env['LOG_ENABLE_CONSOLE'] = 'yes';

      const configs = await load('production');

      expect(configs.get('JWT_SECRET')).toBeUndefined();
      expect(configs.getNumber('DB_PORT')).toBeUndefined();
      expect(configs.getBoolean('LOG_ENABLE_CONSOLE')).toBeUndefined();
    });

    it('only exposes the keys it defines', async () => {
      process.env['SOME_UNRELATED_VAR'] = 'value';

      const configs = await load('production');

      expect(configs.get('SOME_UNRELATED_VAR')).toBeUndefined();
      expect(configs.getAll()).not.toHaveProperty('SOME_UNRELATED_VAR');
    });
  });

  describe('required values', () => {
    it('returns values that are present and valid', async () => {
      process.env['JWT_SECRET'] = 'secret';
      process.env['RMQ_PORT'] = '5672';
      process.env['AUTH_COOKIE_SECURE'] = 'false';

      const configs = await load('production');

      expect(configs.required.get('JWT_SECRET')).toBe('secret');
      expect(configs.required.getNumber('RMQ_PORT')).toBe(5672);
      expect(configs.required.getBoolean('AUTH_COOKIE_SECURE')).toBe(false);
    });

    it.each(['', '   '])('throws when a value is missing or blank (%p)', async (value) => {
      process.env['JWT_SECRET'] = value;

      const configs = await load('production');

      expect(() => configs.required.get('JWT_SECRET')).toThrow(
        'JWT_SECRET not found in configuration',
      );
    });

    it('throws when a value cannot be parsed', async () => {
      process.env['DB_PORT'] = 'abc';
      process.env['LOG_ENABLE_CONSOLE'] = 'yes';

      const configs = await load('production');

      expect(() => configs.required.getNumber('DB_PORT')).toThrow(
        'DB_PORT has an invalid value: "abc"',
      );
      expect(() => configs.required.getBoolean('LOG_ENABLE_CONSOLE')).toThrow(
        'LOG_ENABLE_CONSOLE has an invalid value: "yes"',
      );
    });
  });
});
