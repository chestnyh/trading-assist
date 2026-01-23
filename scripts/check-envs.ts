import * as fs from 'fs';
import * as path from 'path';

const ENV_FILES = [
  { local: '.env.api-int-tests', example: '.env.api-int-tests.example' },
  { local: '.env.dev', example: '.env.dev.example' },
  { local: '.env.devops', example: '.env.devops.example' },
];

const getKeys = (filePath: string): string[] => {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return [];

  return fs.readFileSync(fullPath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=')[0]);
};

let hasError = false;

console.log('🔍 Checking environment files consistency...');

ENV_FILES.forEach(({ local, example }) => {
  const exampleKeys = getKeys(example);
  const localKeys = getKeys(local);

  const missingKeys = exampleKeys.filter(key => !localKeys.includes(key));

  if (missingKeys.length > 0) {
    console.error(`\n❌ Error in ${local}:`);
    console.error(`   Missing keys from ${example}:`);
    missingKeys.forEach(key => console.error(`   - ${key}`));
    hasError = true;
  }
});

if (hasError) {
  console.log('\n💡 Please add these variables to your local .env files.');
  process.exit(1);
} else {
  console.log('✅ All good! Your local envs match the examples.');
  process.exit(0);
}

