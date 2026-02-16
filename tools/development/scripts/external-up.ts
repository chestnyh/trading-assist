import { spawn } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');
const DOCKER_PROFILE = scriptConfigs.get('DOCKER_PROFILE') || 'external';

if (!ENV_FILE) {
  console.error('ENV_FILE not found in configuration');
  process.exit(1);
}

const args = process.argv.slice(2);

const child = spawn(
  'docker',
  ['compose', '--env-file', ENV_FILE, '--profile', DOCKER_PROFILE, 'up', ...args],
  {
    stdio: 'inherit',
  }
);

child.on('error', (error) => {
  console.error(`error: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
