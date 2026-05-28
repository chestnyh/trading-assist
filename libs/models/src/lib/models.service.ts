import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ConnectionParams } from '../types';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        const adapter = new PrismaPg({ connectionString });
        super({ adapter });
    }
    
    async onModuleInit() {
        await this.$connect();
    }
}