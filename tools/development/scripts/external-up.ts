import { spawn } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');
const DOCKER_PROFILE = scriptConfigs.get('DOCKER_PROFILE') || 'external';

if (!ENV_FILE) {
  console.error('ENV_FILE not found in configuration');
  process.exit(1);
}

const args = process.argv.slice(2);

const fileEnv = dotenv.parse(fs.readFileSync(ENV_FILE));
const dockerProjectNameFromFile =
  fileEnv.DOCKER_PROJECT_NAME || fileEnv.COMPOSE_PROJECT_NAME;

const childEnv: NodeJS.ProcessEnv = {
  ...process.env,
  ...(dockerProjectNameFromFile
    ? { DOCKER_PROJECT_NAME: dockerProjectNameFromFile }
    : null),
};

const child = spawn(
  'docker',
  ['compose', '--env-file', ENV_FILE, '--profile', DOCKER_PROFILE, 'up', ...args],
  {
    stdio: 'inherit',
    env: childEnv,
  }
);

child.on('error', (error) => {
  console.error(`error: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
