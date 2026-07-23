export type ModelsModuleOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type ModelsModuleAsyncOptions = {
  useFactory: (...args: any[]) => Promise<ModelsModuleOptions> | ModelsModuleOptions;
  inject?: any[];
};

export function buildDatabaseUrl(options: ModelsModuleOptions): string {
  return `postgresql://${options.username}:${options.password}@${options.host}:${options.port}/${options.database}`;
}
