export interface RandomStringIdHolder {
  generate(): Promise<string>;
}
