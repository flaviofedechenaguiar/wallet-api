import { DatePeriod } from 'src/utils/DatePeriod';

enum TransactionStatus {
  PAIED = 'pago',
  NOT_PAIED = 'nao_pago',
  RECEIVED = 'recebido',
  NOT_RECEIVED = 'nao_recebido',
}

enum TypeSplit {
  INSTALLMENT = 'parcelar',
  REPEAT = 'repetir',
}

export class Transaction {
  constructor(
    public readonly description: string,
    public readonly date: Date,
    public readonly amount: number,
    public readonly status: TransactionStatus,
    public readonly note?: string,
  ) {}
}

type BuildTransactionData = {
  description: string;
  date: Date;
  amount: number;
  note: string;
  status: TransactionStatus;
  split?: {
    type: TypeSplit;
    quantity: number;
    period: number;
  };
};

export class BuildTransactions {
  build(data: BuildTransactionData): Transaction[] {
    if (!data.split) {
      return [this.createTransaction(data)];
    }

    const period = new DatePeriod(data.date, data.split.period);
    const quantityOfSplits = new Array(data.split.quantity);
    const amount = this.getTransactionAmount(
      data.amount,
      data.split.quantity,
      data.split.type,
    );
    const transactions = quantityOfSplits.map(() => {
      return this.createTransaction({
        ...data,
        amount: amount,
        date: period.getNext(),
      });
    });

    return transactions;
  }

  private createTransaction(data: BuildTransactionData): Transaction {
    return new Transaction(
      data.description,
      data.date,
      data.amount,
      data.status,
      data.note,
    );
  }

  private getTransactionAmount(
    amount: number,
    quantity: number,
    type: TypeSplit,
  ): number {
    return type === TypeSplit.REPEAT
      ? amount
      : Number((amount / quantity).toFixed(2));
  }
}
