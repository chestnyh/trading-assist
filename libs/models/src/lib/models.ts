import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../types';
import { Configs } from '@trading-bot/configs';
const configs = new Configs();

export default class Models extends PrismaClient {
    #configs: Configs;
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