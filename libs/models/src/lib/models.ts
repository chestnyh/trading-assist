import { PrismaClient } from '@prisma/client';

export default class Models extends PrismaClient {
    async connect() {
        await this.$connect();
    }

    async disconnect() {
        await this.$disconnect();
    }
}