import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { MODELS_OPTIONS } from './models.constants';
import { buildDatabaseUrl, type ModelsModuleOptions } from './models.options';

@Injectable()
export class ModelsService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(MODELS_OPTIONS) options: ModelsModuleOptions) {
    super({
      adapter: new PrismaPg({ connectionString: buildDatabaseUrl(options) }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async runInTransaction<T>(fn: (tx: this) => Promise<T>): Promise<T> {
    return this.$transaction((tx) => fn(tx as this));
  }
}
