import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IAccountRepository } from 'src/domain/repositories/account/account.repository';
import { CreateAccountData } from 'src/domain/repositories/account/create-account-data';
import { SQLiteUserEntity } from '../entities/user-sqlite.entity';

export class SQLiteAccountRepository implements IAccountRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private user = this.dataSource.getRepository(SQLiteUserEntity);

  async create(data: CreateAccountData): Promise<void> {
    await this.user.save({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }
}
