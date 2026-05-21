import { PrismaClient } from '.prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ConnectionParams } from '../types';
import { ServicesConfigs } from '@trading-bot/configs';
const configs = new ServicesConfigs();

export default class Models extends PrismaClient {
    #configs: ServicesConfigs;
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        const adapter = new PrismaPg({ connectionString });
        super({ adapter });
        this.#configs = configs;
    }

    async connect() {
        await this.connect();
    }

    async disconnect() {
        await this.disconnect();
    }
}