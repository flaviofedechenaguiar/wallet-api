import { DatePeriod } from 'src/utils/DatePeriod';
import { Transaction } from '../entities/transaction.entity';
import { BuildTransactionData } from '../dtos/build-transactions.dto';
import { v4 as uuid } from 'uuid';

export class BuildTransactions {
  private static transactionCode = uuid();

  static build(data: BuildTransactionData): Transaction[] {
    const period = new DatePeriod(data.date, data.period);
    const quantityOfSplits = Array.from(Array(data.installment).keys());

    const transactions = quantityOfSplits.map(() =>
      this.createTransaction({ ...data, date: period.getNext() }),
    );

    return transactions;
  }

  private static createTransaction(data: BuildTransactionData): Transaction {
    return new Transaction(
      data.description,
      data.date,
      data.amount,
      data.status,
      this.transactionCode,
      data.note,
    );
  }
}
