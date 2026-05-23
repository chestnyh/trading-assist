import * as dotenv from 'dotenv';
import * as path from 'path';

export abstract class Configs {
  protected configs: Record<string, string | boolean | undefined> = {};

  constructor(envBasePath?: string){

    console.log('process.env.NODE_ENV', process.env.NODE_ENV);

    const base = envBasePath ?? '.';

    let envFile;
    if (process?.env?.['NODE_ENV'] === 'api-int-tests') {
      envFile = path.join(base, '.env.api-int-tests');
    }
    else if (process?.env?.['NODE_ENV'] !== 'production') {
      envFile = path.join(base, '.env.dev');
    }

    this.configs['ENV_FILE'] = envFile;
    this.configs['NODE_ENV'] = process?.env?.['NODE_ENV'];

    if (envFile) {
      dotenv.config({ path: envFile, override: true });
    }

  }

  get(configName: string): string | boolean | undefined {
    return this.configs[configName];
  }

  getRequired(configName: string): string | boolean {
    const value = this.get(configName);
    if (value === undefined || value === '') {
      throw new Error(`${configName} not found in configuration`);
    }
    return value;
  }

  getAll(): Record<string, string | boolean> {
    const result: Record<string, string | boolean> = {};
    for (const [key, value] of Object.entries(this.configs)) {
      if (typeof value === 'string' || typeof value === 'boolean') {
        result[key] = value;
      }
    }
    return result;
  }
}
