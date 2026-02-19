import * as dotenv from 'dotenv';
import * as fs from 'fs';
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

  get(configName: string): string {
    return this.configs[configName];
  }

  getRequired(configName: string): string {
    const value = this.get(configName);
    if (!value) {
      throw new Error(`${configName} not found in configuration`);
    }
    return value;
  }

  getEnvFromFile(): Record<string, string> {
    const envFile = this.getRequired('ENV_FILE');
    return dotenv.parse(fs.readFileSync(envFile));
  }
}
