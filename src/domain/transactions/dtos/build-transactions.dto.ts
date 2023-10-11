import { TypePeriod } from 'src/utils/DatePeriod/enum';
import { TransactionStatus } from '../enums/transaction-status.enum';

export type BuildTransactionData = {
  description: string;
  date: Date;
  amount: number;
  note: string;
  status: TransactionStatus;
  installment: number;
  period: TypePeriod;
};
