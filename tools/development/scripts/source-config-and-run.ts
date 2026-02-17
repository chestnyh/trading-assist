import { spawn } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();

const ENV_FILE = scriptConfigs.get('ENV_FILE');

if (!ENV_FILE) {
  console.error('ENV_FILE not found in configuration');
  process.exit(1);
}

const cliArgs = process.argv.slice(2);

if (cliArgs.length === 0) {
  console.error('No command provided');
  process.exit(1);
}

const fileEnv = dotenv.parse(fs.readFileSync(ENV_FILE));
const childEnv: NodeJS.ProcessEnv = {
  ...process.env,
  ...fileEnv,
};

const [command, ...commandArgs] = cliArgs;

const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  env: childEnv,
  shell: true,
});

child.on('error', (error) => {
  console.error(`error: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});