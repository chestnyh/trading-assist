import { ConfigSource, ConfigValues } from "./sources/config-source";

/**
 * Getters that throw instead of returning `undefined`.
 * Accessed via {@link Configs.required}, e.g. `config.required.getNumber('PORT')`.
 */
export interface RequiredConfigs {
  get(configName: string): string;
  getNumber(configName: string): number;
  getBoolean(configName: string): boolean;
}

/**
 * Base class for application configuration.
 *
 * Loads raw values from a {@link ConfigSource} (the "initial" config), then lets
 * subclasses derive the final `configs` map from it. Provides typed accessors
 * for reading individual values.
 *
 * Usage: create a subclass, implement {@link setUpConfigSource} and
 * {@link setUpConfigsFromInit}, then call `await instance.setUp()` before reading values.
 *
 * Getters return `undefined` when a value is missing or invalid; use
 * {@link required} for the throwing variants:
 * ```ts
 * config.getNumber('TIMEOUT_MS');           // number | undefined
 * config.required.getNumber('PORT');        // number, throws if missing/invalid
 * ```
 */
export abstract class Configs {
  /** Raw key/value pairs exactly as loaded from the config source. */
  protected initialConfig: ConfigValues = {};
  /** Final key/value pairs populated by {@link setUpConfigsFromInit}; used by all getters. */
  protected configs: ConfigValues = {};
  private configSource: ConfigSource;

  /**
   * Same getters as on the instance, but they throw instead of returning `undefined`.
   *
   * @example
   * const port = config.required.getNumber('PORT');
   * const debug = config.required.getBoolean('DEBUG');
   * const secret = config.required.get('JWT_SECRET');
   */
  readonly required: RequiredConfigs = {
    get: (configName) => this.must(configName, this.get(configName) || undefined),
    getNumber: (configName) => this.must(configName, this.getNumber(configName)),
    getBoolean: (configName) => this.must(configName, this.getBoolean(configName)),
  };

  /**
   * Creates the instance and resolves its config source via {@link setUpConfigSource}.
   * Does not load any values — call {@link setUp} for that.
   */
  constructor(){
    this.configSource = this.setUpConfigSource();
  }

  /**
   * Loads raw values from the config source into `initialConfig`.
   * Does not populate `configs`; use {@link setUp} for full initialization.
   */
  async setUpInitial(){
    this.initialConfig = await this.configSource.load();
  }

  /**
   * Fully initializes the instance: loads the initial config from the source,
   * then builds the final `configs` map from it.
   *
   * @returns This instance, to allow `const cfg = await new MyConfigs().setUp()`.
   */
  async setUp(): Promise<this>{
    await this.setUpInitial();
    this.setUpConfigsFromInit();
    return this;
  }

  /**
   * Returns the source the raw configuration is loaded from
   * (e.g. environment variables, a file, a remote store).
   * Called once, from the constructor.
   */
  protected abstract setUpConfigSource(): ConfigSource;

  /**
   * Populates `configs` from `initialConfig` — e.g. filtering, renaming,
   * applying defaults or deriving values. Called by {@link setUp} after loading.
   */
  protected abstract setUpConfigsFromInit(): void;

  /**
   * Returns the raw string value of a config.
   *
   * @param configName - Key to look up.
   * @returns The value, or `undefined` if the key is not set.
   */
  get(configName: string): string | undefined {
    return this.configs[configName];
  }

  /**
   * Returns a shallow copy of the raw config as loaded from the source,
   * before {@link setUpConfigsFromInit} processing.
   */
  getAllInitial(): ConfigValues{
    return {...this.initialConfig};
  }

  /**
   * Returns a shallow copy of the final, processed config map.
   */
  getAll(): ConfigValues {
    return {...this.configs};
  }

  /**
   * Reads a config as a boolean. Matching is case-insensitive and ignores
   * surrounding whitespace.
   *
   * @param configName - Key to look up.
   * @returns `true` for "true", `false` for "false", otherwise `undefined`
   *   (including when the key is not set).
   */
  getBoolean(configName: string): boolean | undefined {
    const value = this.configs[configName];
    if (value === undefined) return undefined;
    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    return undefined;
  }

  /**
   * Reads a config as a number (surrounding whitespace is ignored).
   *
   * @param configName - Key to look up.
   * @returns The parsed number, or `undefined` if the key is not set, empty,
   *   or not a finite number (e.g. "abc", "Infinity").
   */
  getNumber(configName: string): number | undefined {
    const value = this.configs[configName];
    if (value === undefined) return undefined;
    const trimmed = String(value).trim();
    if (trimmed === '') return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  /**
   * Returns `value` if defined; otherwise throws an error that says whether
   * the config is missing or present but invalid.
   */
  private must<T>(configName: string, value: T | undefined): T {
    if (value !== undefined) return value;
    const raw = this.configs[configName];
    if (raw === undefined || String(raw).trim() === '') {
      throw new Error(`${configName} not found in configuration`);
    }
    throw new Error(`${configName} has an invalid value: "${raw}"`);
  }

}
