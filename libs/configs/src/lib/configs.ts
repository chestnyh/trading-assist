import { ConfigSource } from "./sources/config-source";

export abstract class Configs {
  protected initialConfig: Record<string, string> = {};
  protected configs: Record<string, string> = {};
  private configSource: ConfigSource;

  constructor(){
    this.configSource = this.setUpConfigSource();
  }

  async setUp(): Promise<Configs>{
    await this.configSource.load();
    return this;
  }

  protected abstract setUpConfigSource(): ConfigSource;

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

  getAll(): Record<string, string> {
    return {...this.configs};
  }

  getBoolean(configName: string): boolean {
    
    const config = this.configs[configName];
    if(config === undefined){
      return;  
    }
    if(config[configName] === 'true'){
      return true;
    }
    if(config[configName] === 'false'){
      return false;
    }

    
    
  }

  getString(configName: string): string{

  }

  getNumber(configName: string): number{

  }

  getArray(configName: string): [] {
    
  }

  getObjet(configName: string): {} {

  }

}
