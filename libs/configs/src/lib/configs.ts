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

  get(configName: string): string {
    return this.configs[configName];
  }
}
