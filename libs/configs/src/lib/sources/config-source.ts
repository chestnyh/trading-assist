/** Configuration as key/value pairs, keyed by config name. */
export type ConfigValues = Record<string, string>;

/**
 * Abstraction over where configuration values come from.
 *
 * `Configs` depends on this interface rather than on a concrete source
 * (Dependency Inversion), so each implementation acts as an interchangeable
 * strategy (Strategy pattern) for loading configuration.
 */
export interface ConfigSource {
  /** Loads configuration as key/value pairs. */
  load(): Promise<ConfigValues>;
}
