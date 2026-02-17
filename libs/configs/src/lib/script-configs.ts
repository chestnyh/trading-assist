import { Configs } from "./configs";

/**
 * TODO add description
 */
export class ScriptConfigs extends Configs {
  constructor() {
    super();
    const dockerProjectName =
      process.env['DOCKER_PROJECT_NAME'] || process.env['COMPOSE_PROJECT_NAME'];
    this.configs = {
      ...this.configs,
      DOCKER_PROJECT_NAME: dockerProjectName,
      DOCKER_DB_VOLUME: process.env['DOCKER_DB_VOLUME'],
      DOCKER_PROFILE: process.env['DOCKER_PROFILE'] || 'external',
    };
  }
}