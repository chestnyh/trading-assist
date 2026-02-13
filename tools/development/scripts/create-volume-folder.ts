import { ScriptConfigs } from '@trading-bot/configs'; 
import { existsSync, mkdirSync } from 'fs';

const scriptConfigs = new ScriptConfigs();

const DOCKER_DB_VOLUME = scriptConfigs.get('DOCKER_DB_VOLUME');

if (!DOCKER_DB_VOLUME) {
  console.error('DOCKER_DB_VOLUME not found in configuration');
  process.exit(1);
}
if (existsSync(DOCKER_DB_VOLUME)) {
  console.log(`✓ Directory already exists: ${DOCKER_DB_VOLUME}`);
  process.exit(0);
}

mkdirSync(DOCKER_DB_VOLUME, { recursive: true });
console.log(`✓ Directory for docker volume created: ${DOCKER_DB_VOLUME}`);