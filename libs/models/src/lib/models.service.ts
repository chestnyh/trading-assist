import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { ConnectionParams } from '../types';

@Injectable()
export class ModelsService implements OnModuleInit {
    private prisma: PrismaClient;

    constructor(params: ConnectionParams) {
        const { host, port, user, password, database } = params;
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

        // For Prisma 7, set connection string via environment variable
        process.env.DATABASE_URL = connectionString;

        this.prisma = new PrismaClient();
    }

    // Delegate all model properties
    get user() { return this.prisma.user; }
    get userRules() { return this.prisma.userRules; }
    get userRuleSettings() { return this.prisma.userRuleSettings; }
    get ruleSettingsTags() { return this.prisma.ruleSettingsTags; }
    get outboxMessage() { return this.prisma.outboxMessage; }
    get passwordReset() { return this.prisma.passwordReset; }
    get externalServices() { return this.prisma.externalServices; }

    // Delegate PrismaClient methods
    get $connect() { return this.prisma.$connect.bind(this.prisma); }
    get $disconnect() { return this.prisma.$disconnect.bind(this.prisma); }
    get $transaction() { return this.prisma.$transaction.bind(this.prisma); }

    async onModuleInit() {
        await this.$connect();
    }

    async runInTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
        return this.$transaction((tx) => fn(tx));
    }
}