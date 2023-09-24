import { WalletData } from 'src/domain/wallets/dtos/wallet-data';

export type GetWalletOutput = {
  user_id: number;
} & Omit<WalletData, 'userId'>;
