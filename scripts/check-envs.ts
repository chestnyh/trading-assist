import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'dotenv';
import * as readline from 'readline';

const ENV_FILES = [
  { local: '.env.api-int-tests', example: '.env.api-int-tests.example' },
  { local: '.env.dev', example: '.env.dev.example' },
  { local: '.env.devops', example: '.env.devops.example' },
];

const args = process.argv.slice(2);
const isBeforeCommit = args.includes('--before-commit=true');
const isAfterPull = args.includes('--after-pull=true');

const getEnvData = (filePath: string): Record<string, string> => {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return {};
  return parse(fs.readFileSync(fullPath));
};

const getDifference = (source: string[], target: string[]): string[] => {
  return source.filter(key => !target.includes(key));
};

const run = async () => {

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

  console.log(`🔍 Checking envs (${isBeforeCommit ? 'Pre-commit' : 'Post-pull'} mode)...`);

  for (const { local, example } of ENV_FILES) {
    const exampleData = getEnvData(example);
    const localData = getEnvData(local);

    if (isAfterPull) {
      const missingInLocal = getDifference(Object.keys(exampleData), Object.keys(localData));

      if (missingInLocal.length > 0) {
        console.log(`\n⚠️  Missing keys in ${local}: ${missingInLocal.join(', ')}`);

        for (const key of missingInLocal) {
          const value = exampleData[key];
          const answer = await ask(`Add "${key}=${value}" to ${local}? (y/n): `);

          if (answer.toLowerCase() === 'y') {
            const localPath = path.resolve(process.cwd(), local);
            const content = fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf-8') : '';
            const newLine = content.endsWith('\n') || content === '' ? '' : '\n';

            fs.appendFileSync(localPath, `${newLine}${key}=${value}\n`);
            console.log(`✅ Added: ${key}=${value}`);
          } else {
            console.log(`⏭️  Skipped ${key}. Please update it manually later.`);
            process.exit(0);
          }
        }
      }
    }

    if (isBeforeCommit) {
      const missingInExample = getDifference(Object.keys(localData), Object.keys(exampleData));

      if (missingInExample.length > 0) {
        console.error(`\n❌ Commit blocked!\n❌ Error: New keys in ${local} missing in ${example}:`);
        missingInExample.forEach(key => console.error(`   - ${key}`));
        process.exit(1);
      }
    }
  }

  rl.close();

  console.log('\n✅ Everything is up to date.');
  process.exit(0);
};

run();
