import { join } from 'node:path';

import { Configs } from "./configs";
import { findWorkspaceRoot } from "./workspace-root";

import { EnvFileConfigSource } from './sources/env-file.source';
/**
 * Configuration for local helper script
 *
 * Values are loaded from the `.env.dev` file in the workspace root.
 */
export class ScriptConfigs extends Configs {

  setUpConfigsFromInit() {
    this.configs = {
      ...this.configs,
      DOCKER_PROJECT_NAME: this.initialConfig['DOCKER_PROJECT_NAME'],
      DOCKER_DB_VOLUME: this.initialConfig['DOCKER_DB_VOLUME'],
      DOCKER_RMQ_VOLUME: this.initialConfig['DOCKER_RMQ_VOLUME'],
      DOCKER_PROFILE: this.initialConfig['DOCKER_PROFILE'] || 'external',
    };
  }

  setUpConfigSource() {
    return new EnvFileConfigSource(join(findWorkspaceRoot(), ".env.dev"));
  }
}