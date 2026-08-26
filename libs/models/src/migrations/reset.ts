import { execSync } from 'node:child_process';
import { join } from 'node:path';
import './_set-configs';

// TODO add caution that this will delete all existing data
// TODO throw an error if production environment
const args = process.argv.slice(2).join(' ');
const schemaPath = join(__dirname, '../../prisma/schema.prisma');

execSync(`DB_URL=${process.env.DB_URL} prisma migrate reset --force --schema ${schemaPath} ${args}`, {
  stdio: 'inherit',
  env: {
    ...process.env,
  },
});