import { execSync } from 'node:child_process';
import './_set-configs';

// TODO add caution that this will delete all existing data
// TODO throw an error if production environment
const args = process.argv.slice(2).join(' ');

execSync(`DB_URL=${process.env.DB_URL} prisma migrate reset --force --schema ./libs/models/prisma/schema.prisma ${args}`, {
  stdio: 'inherit',
  env: {
    ...process.env,
  },
});
