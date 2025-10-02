import { PrismaClient } from '@prisma/client';
import './_set-configs'

const filePath: string = process.argv[2];

const prisma = new PrismaClient();
async function main() {
    const {default: seedDataGetter} = await import(filePath);
    const seedData = await seedDataGetter();
    Object.keys(seedData).forEach(async (modelName) => {
        const items = seedData[modelName];
        console.log(items);
        items.forEach(async (item) => {
            await prisma[modelName].upsert(item)
        });
    });
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