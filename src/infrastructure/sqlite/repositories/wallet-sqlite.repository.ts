import { DataSource, Equal } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet-repository';
import { SQLiteWalletEntity } from '../entities/wallet-sqlite.entity';
import { WalletData } from 'src/domain/repositories/wallet/wallet-data';

export class SQLiteWalletRepository implements IWalletRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private wallet = this.dataSource.getRepository(SQLiteWalletEntity);

  async create(data: Omit<WalletData, 'id'>): Promise<void> {
    this.wallet.save({
      description: data.description,
      slug: data.slug,
      amount: data.amount,
      user: { id: data.userId },
    });
  }

  async update(
    id: number,
    data: Omit<WalletData, 'id' | 'userId'>,
  ): Promise<void> {
    await this.wallet.save({
      id,
      description: data.description,
      slug: data.slug,
      amount: data.amount,
    });
  }

  async findBySlugAndUserId(
    slug: string,
    userId: number,
  ): Promise<WalletData | null> {
    const result = await this.wallet.findOne({
      where: {
        slug: Equal(slug),
        user: { id: Equal(userId) },
      },
    });
    if (!result) return null;

    return {
      id: result.id,
      description: result.description,
      slug: result.slug,
      amount: result.amount,
      userId: result.user_id,
    };
  }

  async findByUserId(userId: number): Promise<WalletData | null> {
    const result = await this.wallet.findOne({
      where: { user: { id: Equal(userId) } },
    });
    if (!result) return null;

    return {
      id: result.id,
      description: result.description,
      slug: result.slug,
      amount: result.amount,
      userId: result.user_id,
    };
  }
}
