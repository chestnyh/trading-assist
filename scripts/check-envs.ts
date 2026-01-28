/**
 * DESCRIPTION:
 * This script ensures consistency between local environment files (.env.***)
 * and their corresponding template files (.env.***.example).
 *
 * MOTIVATION:
 * To prevent runtime errors caused by missing environment variables after
 * pulling new code or adding new features.
 *
 * USAGE:
 * 1. Automatically runs via Husky hooks:
 * - pre-commit: Prevents committing if .example files are not updated with new local keys.
 * - post-merge: Prompts to add new keys to local .env files after git pull.
 * 2. Can be run manually: pnpm check:envs
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'dotenv';
import * as readline from 'readline';

const ENV_FILES = [
  { local: '.env.api-int-tests', example: '.env.api-int-tests.example' },
  { local: '.env.dev', example: '.env.dev.example' },
  { local: '.env.devops', example: '.env.devops.example' },
];

const getKeys = (filePath: string): string[] => {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return [];
  return Object.keys(parse(fs.readFileSync(fullPath)));
};

const run = async () => {
  let hasError = false;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

  console.log('🔍 Checking environment files consistency...');

  for (const { local, example } of ENV_FILES) {
    const exampleKeys = getKeys(example);
    const localKeys = getKeys(local);

    const missingInLocal = exampleKeys.filter(key => !localKeys.includes(key));
    if (missingInLocal.length > 0) {
      console.log(`\n⚠️  Missing keys in ${local}: ${missingInLocal.join(', ')}`);
      for (const key of missingInLocal) {
        const answer = await ask(`Add "${key}" to ${local}? (y/n): `);
        if (answer.toLowerCase() === 'y') {
          const localPath = path.resolve(process.cwd(), local);
          const content = fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf-8') : '';
          const newLine = content.endsWith('\n') || content === '' ? '' : '\n';
          fs.appendFileSync(localPath, `${newLine}${key}=\n`);
          console.log(`   ✅ Added to ${local}`);
        } else {
          hasError = true;
        }
      }
    }

    const missingInExample = localKeys.filter(key => !exampleKeys.includes(key));
    if (missingInExample.length > 0) {
      console.error(`\n❌ Error: New keys found in ${local} but missing in ${example}:`);
      missingInExample.forEach(key => console.error(`   - ${key}`));
      console.log(`💡 Please add these keys to ${example} before committing!`);
      hasError = true;
    }
  }

  rl.close();

  if (hasError) {
    process.exit(1);
  } else {
    console.log('\n✅ All good! Your local environment and example files are perfectly synced.');
    process.exit(0);
  }
};

run();