import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../types';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
    
    private readonly logger = new Logger(ModelsService.name);
    private readonly connectionParams: ConnectionParams;
    
    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        super({datasourceUrl: url});
        this.connectionParams = params;
    }
    
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (err) {
            const { host, port, user, database } = this.connectionParams;
            this.logger.error(`Failed to connect to DB (host=${host}, port=${port}, user=${user}, database=${database})`);
            throw err;
        }
    }
}