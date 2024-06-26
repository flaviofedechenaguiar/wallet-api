import { DataSource, Equal } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SQLiteWalletEntity } from '../models/wallet.model';
import { CreateWalletData } from '../dtos/create-wallet-data.dot';
import { UpdateWalletData } from '../dtos/update-wallet-data.dot';
import { WalletData } from '../dtos/wallet-data';

export class WalletRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private wallet = this.dataSource.getRepository(SQLiteWalletEntity);

  async create(data: CreateWalletData): Promise<void> {
    this.wallet.save({
      description: data.description,
      slug: data.slug,
      amount: data.amount,
      user: { id: data.userId },
    });
  }

  async update(id: number, data: UpdateWalletData): Promise<void> {
    await this.wallet.save({
      id,
      description: data.description,
      slug: data.slug,
      amount: data.amount,
    });
  }

  async queryAllByUserId(userId: number): Promise<WalletData[]> {
    const results = await this.wallet.find({
      where: { user_id: Equal(userId) },
    });

    return results.map((wallet) => {
      return {
        id: wallet.id,
        description: wallet.description,
        slug: wallet.slug,
        amount: wallet.amount,
        userId: wallet.user_id,
      };
    });
  }

  async findByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<WalletData | null> {
    const result = await this.wallet.findOne({
      where: { id: Equal(id), user_id: Equal(userId) },
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

  async findBySlugAndUserId(
    slug: string,
    userId: number,
  ): Promise<WalletData | null> {
    const result = await this.wallet.findOne({
      where: { slug: Equal(slug), user: { id: Equal(userId) } },
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

  async delete(id: number, userId: number): Promise<void> {
    await this.wallet.softDelete({ id, user_id: userId });
  }
}
