import { exec } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');

const args = process.argv.slice(2).join(' ');

exec(
  `docker compose --env-file ${ENV_FILE} --profile api-service-int-tests up ${args}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);
  }
);
