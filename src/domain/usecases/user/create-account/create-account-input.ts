import { User } from 'src/domain/entities/user.entity';
import { Wallet } from 'src/domain/entities/wallet.entity';

export class CreateAccountInput {
  public constructor(
    public name: string,
    public email: string,
    public password: string,
    public walletDescription: string,
    public walletInitialAmount: number,
  ) {}

  public mapToUserEntity(): User {
    return new User(this.name, this.email, this.password);
  }

  public mapToWalletEntity(): Wallet {
    return new Wallet(this.walletDescription, this.walletInitialAmount);
  }
}
