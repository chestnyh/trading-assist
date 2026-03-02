import { ScriptConfigs } from '@trading-bot/configs'; 
import { existsSync, mkdirSync } from 'fs';

const scriptConfigs = new ScriptConfigs();

const DOCKER_DB_VOLUME = scriptConfigs.get('DOCKER_DB_VOLUME');
const DOCKER_RMQ_VOLUME = scriptConfigs.get('DOCKER_RMQ_VOLUME');

const volumes = [DOCKER_DB_VOLUME, DOCKER_RMQ_VOLUME].filter(Boolean) as string[];

if (volumes.length === 0) {
  console.error('No docker volumes configured (DOCKER_DB_VOLUME / DOCKER_RMQ_VOLUME)');
  process.exit(1);
}

let created = false;

for (const volumePath of volumes) {
  if (existsSync(volumePath)) {
    console.log(`✓ Directory already exists: ${volumePath}`);
    continue;
  }

  mkdirSync(volumePath, { recursive: true });
  console.log(`✓ Directory for docker volume created: ${volumePath}`);
  created = true;
}

process.exit(created ? 0 : 0);