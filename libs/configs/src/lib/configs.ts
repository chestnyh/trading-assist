export abstract class Configs {
  protected initialConfig: Record<string, string | undefined> = {};
  protected configs: Record<string, string | boolean | undefined> = {};

  constructor(){
    this.loadConfig();
  }

  loadConfig(){
    throw new Error(`${this.constructor.name} must implement loadConfig()`);
  }

  get(configName: string): string | boolean | undefined {
    return this.configs[configName];
  }

  getRequired(configName: string): string | boolean {
    const value = this.get(configName);
    if (value === undefined || value === '') {
      throw new Error(`${configName} not found in configuration`);
    }
    return value;
  }

  getAll(): Record<string, string | boolean> {
    const result: Record<string, string | boolean> = {};
    for (const [key, value] of Object.entries(this.configs)) {
      if (typeof value === 'string' || typeof value === 'boolean') {
        result[key] = value;
      }
    }
    return result;
  }
}
