import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { buildDatabaseUrl, type ModelsModuleOptions } from './models.options';

export default class Models extends PrismaClient {
  constructor(options: ModelsModuleOptions) {
    super({
      adapter: new PrismaPg({ connectionString: buildDatabaseUrl(options) }),
    });
  }

  async connect() {
    await this.$connect();
  }

  async disconnect() {
    await this.$disconnect();
  }
}
