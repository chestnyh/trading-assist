import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async runInTransaction<T>(fn: (tx: this) => Promise<T>): Promise<T> {
        return this.$transaction((tx) => fn(tx as this));
    }
}