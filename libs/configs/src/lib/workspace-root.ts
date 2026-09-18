import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

/** TODO this is a temporarry solution. This should be solved in workspace helper tool */
const WORKSPACE_MARKER = 'pnpm-workspace.yaml';

export function findWorkspaceRoot(from: string = __dirname): string {
  let dir = from;

  for (;;) {
    if (existsSync(join(dir, WORKSPACE_MARKER))) {
      return dir;
    }

    const parent = dirname(dir);

    if (parent === dir || dir === parse(dir).root) {
      throw new Error(
        `Workspace root not found: no ${WORKSPACE_MARKER} in any directory above ${from}`
      );
    }

    dir = parent;
  }
}
