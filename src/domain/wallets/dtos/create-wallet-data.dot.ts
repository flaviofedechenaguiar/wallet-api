import { WalletData } from './wallet-data';

export type CreateWalletData = Omit<WalletData, 'id'>;
