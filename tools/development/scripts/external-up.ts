import { spawn } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');
const DOCKER_PROFILE = scriptConfigs.get('DOCKER_PROFILE');
const DOCKER_PROJECT_NAME = scriptConfigs.get('DOCKER_PROJECT_NAME');

if (!ENV_FILE) {
  console.error('ENV_FILE not found in configuration');
  process.exit(1);
}

if (!DOCKER_PROJECT_NAME) {
  console.error(
    `DOCKER_PROJECT_NAME not found in configuration. Please set DOCKER_PROJECT_NAME (or legacy COMPOSE_PROJECT_NAME) in ${ENV_FILE}`
  );
  process.exit(1);
}

const args = process.argv.slice(2);

const child = spawn(
  'docker',
  ['compose', '--env-file', ENV_FILE, '--profile', DOCKER_PROFILE, 'up', ...args],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...(DOCKER_PROJECT_NAME ? { DOCKER_PROJECT_NAME } : null),
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
