import { User } from 'src/domain/entities/user.entity';
import { Wallet } from 'src/domain/entities/wallet.entity';

export class CreateAccountData {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public walletDescription: string,
    public walletAmount: number,
  ) {}

  static mapFromEntity(user: User, wallet: Wallet): CreateAccountData {
    return new CreateAccountData(
      user.name,
      user.email,
      user.password,
      wallet.description,
      wallet.amount,
    );
  }
}
