import { UserData } from 'src/domain/data/user.data';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';
import { DataSource, Equal } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SQLiteUserEntity } from '../entities/user-sqlite.entity';

export class SQLiteUserRepository implements IUserRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private user = this.dataSource.getRepository(SQLiteUserEntity);

  async add(data: UserData): Promise<UserData> {
    const result = await this.user.save({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return new UserData(result.name, result.email, result.password, result.id);
  }

  async update(id: number, data: UserData): Promise<UserData> {
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
