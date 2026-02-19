import fs from 'fs';
import { ScriptConfigs } from '@trading-bot/configs';

const scriptConfigs = new ScriptConfigs();

const envFile = scriptConfigs.get('ENV_FILE');

if (!envFile) {
  console.error('ENV_FILE not found in configuration');
  process.exit(1);
}

if (!fs.existsSync(envFile)) {
  console.error(`ENV_FILE does not exist: ${envFile}`);
  process.exit(1);
}

console.log(`✓ ${envFile} exists`);