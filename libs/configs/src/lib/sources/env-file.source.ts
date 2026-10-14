import { readFile } from 'node:fs/promises';

import type { ConfigSource, ConfigValues } from './config-source';

/**
 * Loads configuration from a dotenv file.
 *
 * The file is parsed and `${VAR}` references are expanded from the file's own values,
 * without writing anything to `process.env`.
 *
 * `dotenv` / `dotenv-expand` are pulled in lazily via `require` so that they are
 * only touched when an env file is actually read. Some environments may not require
 * `dotenv` / `dotenv-expand` usage, so we don't need it in this case
 */
export class EnvFileConfigSource implements ConfigSource {
  constructor(readonly envFilePath: string) {}

  async load(): Promise<ConfigValues> {
    // Lazy, synchronous require on purpose: keeps `dotenv` / `dotenv-expand` as
    // dev-only packages that production (ProcessEnvConfigSource) never resolves.
    /* eslint-disable @typescript-eslint/no-var-requires */
    const dotenv = require('dotenv') as typeof import('dotenv');
    const dotenvExpand = require('dotenv-expand') as typeof import('dotenv-expand');
    /* eslint-enable @typescript-eslint/no-var-requires */
    const fileContent = await readFile(this.envFilePath);
    const parsed = dotenv.parse(fileContent);
    //`processEnv: {}` makes dotenv-expand write into a throwaway object instead of `process.env`.
    const result = dotenvExpand.expand({ parsed, processEnv: {} });
    return result.parsed ?? {};
  }
}
