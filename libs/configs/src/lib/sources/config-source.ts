/**
 * A `ConfigSource` knows how to bring a set of configuration values into
 * `process.env` for the current environment. Concrete sources decide *where*
 * those values come from (a local env file, the container's own environment,
 * a secrets manager, ...), while the `Configs` classes stay a typed view over
 * `process.env` and never care about the origin.
 */
export interface ConfigSource {
  /**
   * Path of the env file this source reads, when it is file-based. Surfaced as
   * the `ENV_FILE` config value (scripts rely on it); `undefined` for sources
   * that are not backed by a file.
   */
  readonly envFilePath?: string;

  /**
   * Populate `process.env` with this source's values. Must be idempotent so
   * that constructing several `Configs` instances in one process is safe.
   *
   * The return type allows a future source (e.g. AWS Secrets Manager) to be
   * asynchronous without breaking callers that already `await loadEnv()`.
   */
  load(): Record<string, string | undefined> | Promise<Record<string, string | undefined>>;
}
