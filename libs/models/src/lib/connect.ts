import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../index.d';  

export default class Database extends PrismaClient {
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        super({datasourceUrl: url});
    }

    async connect() {
        await this.$connect();
    }

    async disconnect() {
        await this.$disconnect();
    }
} 