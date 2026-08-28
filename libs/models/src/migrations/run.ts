import { execSync } from 'child_process';
import './_set-configs';

execSync(
  `DB_URL=${process.env.DB_URL} pnpm --filter @trading-bot/models exec prisma migrate deploy --schema ./prisma/schema.prisma`,
  { stdio: 'inherit' }
);