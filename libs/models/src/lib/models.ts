import { PrismaClient } from '../generated/prisma/client';
import type { ConnectionParams } from '../types';
import { ServicesConfigs } from '@trading-bot/configs';
const configs = new ServicesConfigs();

export default class Models extends PrismaClient {
    #configs: ServicesConfigs;
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        super({
            datasources: {
                db: {
                    url: connectionString,
                },
            },
        });
        this.#configs = configs;
    }

    async connect() {
        await this.connect();
    }

    async disconnect() {
        await this.disconnect();
    }
}