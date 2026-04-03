import * as dotenv from 'dotenv';
export abstract class Configs {
  protected configs: Record<string, string | undefined> = {};

  constructor(){

    let envFile;
    if (process?.env?.['NODE_ENV'] === 'api-int-tests') {
      envFile = './.env.api-int-tests';
    }
    else if (process?.env?.['NODE_ENV'] !== 'production') {
      envFile = './.env.dev';
    }

    this.configs['ENV_FILE'] = envFile;
    this.configs['NODE_ENV'] = process?.env?.['NODE_ENV'];

    if (envFile) {
      dotenv.config({ path: envFile, override: true });
    }

  }

  get(configName: string): string | undefined {
    return this.configs[configName];
  }

  getBoolean(configName: string): boolean | undefined {
    const value = this.get(configName);
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
      return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
      return false;
    }

    return undefined;
  }

  getRequired(configName: string): string {
    const value = this.get(configName);
    if (!value) {
      throw new Error(`${configName} not found in configuration`);
    }
    return value;
  }

  getAll(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.configs)) {
      if (typeof value === 'string') {
        result[key] = value;
      }
    }
    return result;
  }
}
