import { spawn } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

let ENV_FILE: string;
let DOCKER_PROFILE: string;
let DOCKER_PROJECT_NAME: string;

try {
  ENV_FILE = scriptConfigs.getRequired('ENV_FILE') as string;
  DOCKER_PROFILE = scriptConfigs.getRequired('DOCKER_PROFILE') as string;
  DOCKER_PROJECT_NAME = scriptConfigs.getRequired('DOCKER_PROJECT_NAME') as string;
} catch (error) {
  console.error(`error: ${(error as Error).message}`);
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
