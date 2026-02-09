import { exec } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 
import { mkdirSync } from 'fs';

const scriptConfigs = new ScriptConfigs();


const DOCKER_DB_VOLUME = scriptConfigs.get('DOCKER_DB_VOLUME');

if (!DOCKER_DB_VOLUME) {
  console.error('DOCKER_DB_VOLUME not found in configuration');
  process.exit(1);
}
// Run docker compose
const args = process.argv.slice(2).join(' ');
exec(
  `docker compose --env-file .env.api-int-tests --profile api-service-int-tests up ${args}`,
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
