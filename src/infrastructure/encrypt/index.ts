import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import * as bcrypt from 'bcrypt';

export class EncryptBCrypt implements IEncrypt {
  public constructor(private salt: number) {}

  async hash(data: string): Promise<string> {
    const generatedSalt = await bcrypt.genSalt(this.salt);
    return await bcrypt.hash(data, generatedSalt);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}
