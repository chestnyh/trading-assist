import { ConfigSource } from "./sources/config-source";

export abstract class Configs {
  protected initialConfig: Record<string, string> = {};
  protected configs: Record<string, string> = {};
  private configSource: ConfigSource;

  constructor(){
    this.configSource = this.setUpConfigSource();
  }

  async setUpInitial(){
    this.initialConfig = await this.configSource.load();
  }

  async setUp(): Promise<Configs>{
    this.setUpInitial();
    this.setUpConfigsFromInit();
    return this;
  }

  protected abstract setUpConfigSource(): ConfigSource;
  protected abstract setUpConfigsFromInit()

  get(configName: string): string {
    return this.configs[configName];
  }

  getRequired(configName: string): string | boolean {
    const value = this.get(configName);
    if (value === undefined || value === '') {
      throw new Error(`${configName} not found in configuration`);
    }
    return value;
  }

  getAllInitial(): Record<string, string>{
    return {...this.initialConfig};
  }

  getAll(): Record<string, string> {
    return {...this.configs};
  }

  getBoolean(configName: string): boolean {
    const value = this.configs[configName];
    if (value === undefined) return undefined;
    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    return undefined;
  }

  getNumber(configName: string): number {
    const value = this.configs[configName];
    if (value === undefined) return undefined;
    const parsed = Number(String(value).trim());
    return Number.isFinite(parsed) ? parsed : undefined;
  }

}
