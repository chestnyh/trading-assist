import 'dotenv/config';
import { execSync } from 'node:child_process';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
  throw new Error('Database env vars are missing');
}

const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

execSync('pnpm prisma generate --schema ./libs/models/prisma/schema.prisma', {
  stdio: 'inherit',
  env: {
    ...process.env,
    DB_URL,
  },
});
