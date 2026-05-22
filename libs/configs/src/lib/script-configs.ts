import { Configs } from "./configs";

/**
 * TODO add description
 */
export class ScriptConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      ...this.configs,
      DOCKER_PROJECT_NAME: process.env['DOCKER_PROJECT_NAME'],
      DOCKER_DB_VOLUME: process.env['DOCKER_DB_VOLUME'],
      DOCKER_RMQ_VOLUME: process.env['DOCKER_RMQ_VOLUME'],
      DOCKER_PROFILE: process.env['DOCKER_PROFILE'] || 'external',
    };
  }
}