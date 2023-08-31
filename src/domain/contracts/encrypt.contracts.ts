export interface IEncrypt {
  hash(data: string): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
}
