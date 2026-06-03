import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../types';
import { ServicesConfigs } from '@trading-bot/configs';
const configs = new ServicesConfigs();

export default class Models extends PrismaClient {
    #configs: ServicesConfigs;
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;

        // For Prisma 7, set connection string via environment variable
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        process.env.DATABASE_URL = connectionString;

        super();
        this.#configs = configs;
    }

    async connect() {
        await this.$connect();
    }

    async disconnect() {
        await this.$disconnect();
    }
}