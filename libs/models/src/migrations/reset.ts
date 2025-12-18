import { execSync } from 'node:child_process';
import './_set-configs';

// TODO add caution that this will delete all existing data
// TODO throw an error if production environment
execSync('prisma migrate reset --schema ./libs/models/prisma/schema.prisma', {
  stdio: 'inherit',
  env: {
    ...process.env,
  },
});
