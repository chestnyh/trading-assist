import { spawn } from 'child_process';
import { ScriptConfigs } from '@trading-bot/configs'; 

const scriptConfigs = new ScriptConfigs();
let fileEnv: Record<string, string>;

try {
  fileEnv = scriptConfigs.getAll();
} catch (error) {
  console.error(`error: ${(error as Error).message}`);
  process.exit(1);
}

const cliArgs = process.argv.slice(2);

if (cliArgs.length === 0) {
  console.error('No command provided');
  process.exit(1);
}

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