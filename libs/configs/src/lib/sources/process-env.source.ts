import type { ConfigSource, ConfigValues } from './config-source';

/**
 * Source for environments where the values are already present in
 * `process.env` — production containers and CI, where the orchestrator injects
 * every variable directly and there is no file to read.
 *
 * Returns a snapshot, so later changes to `process.env` don't leak into the
 * loaded config (and vice versa).
 */
export class ProcessEnvConfigSource implements ConfigSource {
  async load(): Promise<ConfigValues> {
    const values: ConfigValues = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        values[key] = value;
      }
    }
    return values;
  }
}
