import { WalletData } from './wallet-data';

export type UpdateWalletData = Omit<WalletData, 'id' | 'userId'>;
