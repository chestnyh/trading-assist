const { execSync } = require('child_process');
require("./_set-configs")

const [name] = process.argv.slice(2);

execSync(`DB_URL=${process.env.DB_URL} pnpm prisma migrate dev --name ${name}`, { stdio: 'inherit' });