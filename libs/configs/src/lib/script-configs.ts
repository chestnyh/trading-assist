import { Configs } from "./configs";

/**
 * TODO add description
 */
export class ScriptConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      ...this.configs,
      DOCKER_PROJECT_NAME: this.initialConfig['DOCKER_PROJECT_NAME'],
      DOCKER_DB_VOLUME: this.initialConfig['DOCKER_DB_VOLUME'],
      DOCKER_RMQ_VOLUME: this.initialConfig['DOCKER_RMQ_VOLUME'],
      DOCKER_PROFILE: this.initialConfig['DOCKER_PROFILE'] || 'external',
    };
  }
}