import * as dotenv from 'dotenv';
if (process?.env?.['NODE_ENV'] === 'api-int-tests') {
    dotenv.config({ path: './.env.api-int-tests' });
}
else if (process?.env?.['NODE_ENV'] !== 'production') {
    dotenv.config({ path: './.env.dev' });
}

type Config = string | number | undefined;

// TODO review this file
export default class Configs {
  private configs: Record<string, Config> = {};

  constructor() {    
    this.#init();
  }

  #init(){
    this.configs = {
      PORT:process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000,
      DB_USER: process.env['DB_USER'],
      DB_PASSWORD: process.env['DB_PASSWORD'],
      DB_NAME: process.env['DB_NAME'],
      DB_HOST: process.env['DB_HOST'],
      DB_PORT: process.env['DB_PORT'] ? parseInt(process.env['DB_PORT'], 10) : 5432,
    };
  }

  get(configName: string): Config {
    return this.configs[configName];
  }
}
