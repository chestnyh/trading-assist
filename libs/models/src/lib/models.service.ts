import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../types';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
    
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        super({datasourceUrl: url});
    }
    
    async onModuleInit() {
        await this.$connect();
    }
}