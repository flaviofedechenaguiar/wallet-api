import { WalletData } from './wallet-data';

export interface IWalletRepository {
  create(data: Omit<WalletData, 'id'>): Promise<void>;
  update(id: number, data: Omit<WalletData, 'id' | 'userId'>): Promise<void>;
  findBySlugAndUserId(slug: string, userId: number): Promise<WalletData | null>;
  findByUserId(userId: number): Promise<WalletData | null>;
}
