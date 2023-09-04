import { CreateAccountData } from './create-account-data';

export interface IAccountRepository {
  create(data: CreateAccountData): Promise<void>;
}
