import { execSync } from 'child_process';
import "./_set-configs";

execSync(`DB_URL=${process.env.DB_URL} PRISMA_GENERATE_SKIP_AUTOINSTALL=true pnpm prisma generate --schema ./libs/models/prisma/schema.prisma`, {
  stdio: 'inherit',
});
