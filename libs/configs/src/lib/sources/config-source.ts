export interface ConfigSource {
  load(): Promise<Record<string, string>>;
}
