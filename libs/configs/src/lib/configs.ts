export abstract class Configs {
  protected configs: Record<string, string> = {};

  get(configName: string): string {
    return this.configs[configName];
  }
}
