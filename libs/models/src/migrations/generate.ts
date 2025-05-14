import { execSync } from 'child_process';
import "./_set-configs";

const [migrationName] = process.argv.slice(2);

if(!migrationName) {
    throw new Error('Migration name is required');
}

execSync(`DB_URL=${process.env.DB_URL} pnpm prisma migrate dev --schema ./libs/models/prisma/schema.prisma --name ${migrationName}`, { stdio: 'inherit' });