import { PrismaClient } from '@prisma/client';
import './_set-configs';

const filePath: string = process.argv[2];

// Prisma Client will use prisma.config.ts for configuration
const prisma = new PrismaClient();
async function main() {
    const {default: seedDataGetter} = await import(filePath);
    const seedData = await seedDataGetter();
    const keys = Object.keys(seedData);
    for (const modelName of keys) {
        const items = seedData[modelName];
        console.log(`Seeding ${modelName}...`);
        for (const item of items) {
            await prisma[modelName].upsert(item);
        }
    }
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })