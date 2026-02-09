import { Configs } from "./configs";

/**
 * TODO add description
 */
export class ScriptConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      ...this.configs,
      DOCKER_DB_VOLUME: process.env['DOCKER_DB_VOLUME'],
    };
  }
}