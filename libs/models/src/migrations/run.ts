import { execSync } from 'child_process';
import { join } from 'node:path';
import './_set-configs';

const schemaPath = join(__dirname, '../../prisma/schema.prisma');

execSync(
  `DB_URL=${process.env.DB_URL} prisma migrate deploy --schema ${schemaPath}`,
  { stdio: 'inherit' }
);