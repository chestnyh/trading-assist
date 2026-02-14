import { exec } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs';

const scriptConfigs = new ScriptConfigs();

const envFile = scriptConfigs.get('ENV_FILE');

if (!envFile) {
  console.error('ENV_FILE not found in configuration');
  process.exit(1);
}

exec(`dotenv -e ${envFile} -- echo "✓ ${envFile} exists"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    process.exit(1);
  }
  console.log(`✓ ${envFile} exists`);
});