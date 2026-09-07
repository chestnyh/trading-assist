import type { ConfigSource } from './config-source';

/**
 * No-op source for environments where the values are already present in
 * `process.env` — production containers and CI, where the orchestrator injects
 * every variable directly and there is no file to read.
 */
export class ProcessEnvConfigSource implements ConfigSource {
  readonly envFilePath = undefined;

  load(): Record<string, string | undefined> {
    // TODO
    return {};
  }
}
