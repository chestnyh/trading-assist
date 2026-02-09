import { ScriptConfigs } from '@trading-bot/configs'; 
import { mkdirSync, statSync } from 'fs';

const scriptConfigs = new ScriptConfigs();

const DOCKER_DB_VOLUME = scriptConfigs.get('DOCKER_DB_VOLUME');

if (!DOCKER_DB_VOLUME) {
  console.error('DOCKER_DB_VOLUME not found in configuration');
  process.exit(1);
}

if (statSync(DOCKER_DB_VOLUME).isDirectory()) {
  console.log(`✓ Directory already exists: ${DOCKER_DB_VOLUME}`);
} else {
  mkdirSync(DOCKER_DB_VOLUME, { recursive: true });
  console.log(`✓ Directory for docker volume created: ${DOCKER_DB_VOLUME}`);
}