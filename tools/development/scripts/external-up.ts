import { exec } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');
const DOCKER_PROFILE = scriptConfigs.get('DOCKER_PROFILE');

const args = process.argv.slice(2).join(' ');

exec(
  `docker compose --env-file ${ENV_FILE} --profile ${DOCKER_PROFILE} up ${args}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.warn(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(stdout);
    }
  }
);
