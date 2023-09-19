import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Equal } from 'typeorm';
import { UserData } from '../dtos/user-data.dto';
import { UpdateAccountData } from '../dtos/update-account-data.dto';
import { CreateAccountData } from '../dtos/create-account-data.dto';
import { SQLiteUserEntity } from '../models/user.model';

export class UserRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private user = this.dataSource.getRepository(SQLiteUserEntity);

  async create(data: CreateAccountData): Promise<UserData> {
    const result = await this.user.save({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return new UserData(result.name, result.email, result.password, result.id);
  }

  async update(id: number, data: UpdateAccountData): Promise<UserData> {
    const result = await this.user.save({
      id,
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return new UserData(result.name, result.email, result.password, result.id);
  }

  async findById(id: number): Promise<UserData> {
    const result = await this.user.findOneBy({ id });

    return new UserData(result.name, result.email, result.password, result.id);
  }

  async findByEmail(email: string): Promise<UserData | null> {
    const result = await this.user.findOneBy({ email: Equal(email) });
    if (!result) return null;

    return new UserData(result.name, result.email, result.password, result.id);
  }

  async delete(id: number): Promise<void> {
    await this.user.softDelete({ id });
  }
}
