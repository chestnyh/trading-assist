import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as path from 'path';

export function loadEnvFile(envFilePath: string): void {
  const result = dotenv.config({ path: envFilePath, override: true });
  dotenvExpand.expand(result);
}

export abstract class Configs {
  protected configs: Record<string, string | boolean | undefined> = {};

  constructor(envBasePath?: string){

    const base = envBasePath ?? '.';

    const nodeEnv = process.env['NODE_ENV'];
    let envFile: string | undefined;
    if (nodeEnv === 'api-int-tests') {
      envFile = path.join(base, '.env.api-int-tests');
    } else if (nodeEnv === 'devops') {
      envFile = path.join(base, '.env.devops');
    } else if (nodeEnv !== 'production') {
      envFile = path.join(base, '.env.dev');
    }

    this.configs['ENV_FILE'] = envFile;
    this.configs['NODE_ENV'] = nodeEnv;

    if (envFile) {
      loadEnvFile(envFile);
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
