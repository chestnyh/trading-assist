import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import type { ConnectionParams } from '../types';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
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
    }
    
    async onModuleInit() {
        await this.$connect();
    }

    async runInTransaction<T>(fn: (tx: this) => Promise<T>): Promise<T> {
        return this.$transaction((tx) => fn(tx as this));
    }
}