import { execSync } from 'child_process';
import "./_set-configs";

execSync(`DB_URL=${process.env.DB_URL} PRISMA_GENERATE_SKIP_AUTOINSTALL=true pnpm --filter @trading-bot/models exec prisma generate --schema ./prisma/schema.prisma`, {
  stdio: 'inherit',
});
