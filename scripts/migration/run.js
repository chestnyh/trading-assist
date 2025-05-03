const { execSync } = require('child_process');

require("./_set-configs")

execSync(`DB_URL=${process.env.DB_URL} prisma migrate deploy`, { stdio: 'inherit' });