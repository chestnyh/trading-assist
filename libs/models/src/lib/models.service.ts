import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import type { ConnectionParams } from '../types';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;

        // For Prisma 7, use adapter pattern
        const pool = new Pool({
            host,
            port,
            user,
            password,
            database,
        });
        const adapter = new PrismaPg(pool);

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async runInTransaction<T>(fn: (tx: this) => Promise<T>): Promise<T> {
        return this.$transaction((tx) => fn(tx as this));
    }
}