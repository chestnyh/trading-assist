import { ServicesConfigs } from '@trading-bot/configs';
import { PrismaClient } from '@prisma/client';

async function main() {
  const configs = new ServicesConfigs();
  const DB_USER = configs.get('DB_USER');
  const DB_PASSWORD = configs.get('DB_PASSWORD');
  const DB_NAME = configs.get('DB_NAME');
  const DB_HOST = configs.get('DB_HOST');
  const DB_PORT = configs.get('DB_PORT');
  process.env.DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  const prisma = new PrismaClient();
  const services = await prisma.externalServices.findMany();
  console.log(JSON.stringify(services, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
