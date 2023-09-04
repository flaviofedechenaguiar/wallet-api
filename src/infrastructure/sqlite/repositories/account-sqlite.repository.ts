import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IAccountRepository } from 'src/domain/repositories/account/account.repository';
import { CreateAccountData } from 'src/domain/repositories/account/create-account-data';
import { SQLiteWalletEntity } from '../entities/wallet-sqlite.entity';
import { SQLiteUserEntity } from '../entities/user-sqlite.entity';

export class SQLiteAccountRepository implements IAccountRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private user = this.dataSource.getRepository(SQLiteUserEntity);
  private wallet = this.dataSource.getRepository(SQLiteWalletEntity);

  async create(data: CreateAccountData): Promise<void> {
    const createdUser = await this.user.save({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    await this.wallet.save({
      description: data.walletDescription,
      amount: data.walletAmount,
      user: { id: createdUser.id },
    });
  }
}
