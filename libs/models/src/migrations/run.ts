import { execSync } from 'child_process';
import './_set-configs';
execSync(
  `DB_URL=${process.env.DB_URL} prisma migrate deploy --schema ./libs/models/prisma/schema.prisma`,
  { stdio: 'inherit' }
);
