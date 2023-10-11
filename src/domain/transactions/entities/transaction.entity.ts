import { TransactionStatus } from '../enums/transaction-status.enum';

export class Transaction {
  constructor(
    public readonly description: string,
    public readonly date: Date,
    public readonly amount: number,
    public readonly status: TransactionStatus,
    public readonly transactionCode: string,
    public readonly note?: string,
  ) {}
}
