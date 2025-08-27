import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../types';
import { ServicesConfigs } from '@trading-bot/configs';
const configs = new ServicesConfigs();

export default class Models extends PrismaClient {
    #configs: ServicesConfigs;
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        
        const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        super({datasourceUrl: url});
        this.#configs = configs;
    }

    async connect() {
        await this.$connect();
    }

    async disconnect() {
        await this.$disconnect();
    }
}