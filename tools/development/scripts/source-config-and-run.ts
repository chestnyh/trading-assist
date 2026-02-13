import { exec } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');

const args = process.argv.slice(2).join(' ');

exec(
  `dotenv -e ${ENV_FILE} -- ${args}`,
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