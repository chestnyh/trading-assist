import { spawn } from 'child_process';
import { ScriptConfigs } from '@trading-assist/configs';

const scriptConfigs = await (new ScriptConfigs()).setUp();

let DOCKER_PROFILE: string;
let DOCKER_PROJECT_NAME: string;

try {
  DOCKER_PROFILE = scriptConfigs.required.get('DOCKER_PROFILE');
  DOCKER_PROJECT_NAME = scriptConfigs.required.get('DOCKER_PROJECT_NAME');
} catch (error) {
  console.error(`error: ${(error as Error).message}`);
  process.exit(1);
}

const args = process.argv.slice(2);

// Compose substitutes ${VAR} in docker-compose.yml from the environment,
// so the `.env.dev` values are passed here instead of via `--env-file`.
// Shell variables still take precedence, as they would with `--env-file`.
const child = spawn(
  'docker',
  ['compose', '--profile', DOCKER_PROFILE, 'up', ...args],
  {
    stdio: 'inherit',
    env: {
      ...scriptConfigs.getAllInitial(),
      ...process.env,
      DOCKER_PROJECT_NAME,
    },
  }
);

child.on('error', (error) => {
  console.error(`error: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
