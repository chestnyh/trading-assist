import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import './_set-configs';

const filePath: string = process.argv[2];

// Create connection pool for Prisma 7.x
const pool = new Pool({
    host: process.env.DB_HOST ? (process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST) : '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
const adapter = new PrismaPg(pool);

// Prisma Client with adapter for Prisma 7.x
const prisma = new PrismaClient({ adapter });

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
        await pool.end()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        await pool.end()
        process.exit(1)
    })