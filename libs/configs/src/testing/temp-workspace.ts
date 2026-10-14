import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * A throwaway workspace root for tests, so env files can be written without
 * touching the real ones. Point `findWorkspaceRoot` at `root` with `jest.mock`.
 */
export class TempWorkspace {
  readonly root = mkdtempSync(join(tmpdir(), 'configs-'));

  /** Writes an env file (e.g. `.env.dev`) into the workspace root. */
  writeEnvFile(name: string, values: Record<string, string>): void {
    const content = Object.entries(values)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    writeFileSync(join(this.root, name), content);
  }

  /** Deletes an env file from the workspace root, if it exists. */
  removeEnvFile(name: string): void {
    rmSync(join(this.root, name), { force: true });
  }

  remove(): void {
    rmSync(this.root, { recursive: true, force: true });
  }
}
