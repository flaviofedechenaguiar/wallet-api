import { IUseCase } from 'src/domain/contracts/usecase.contract';

type Input = {
  description: string;
  date?: Date;
  amount: number;
  category_id: number;
  wallet_id: number;
  note?: string;
  status: string;
  split?: {
    type: string;
    total: string;
    period: number;
  };
};


class Transaction {
  constructor(
    public readonly description: string,
    public readonly date: Date,
    public readonly amount: number,
    public readonly status: string,
    public readonly note: string,
    public readonly split?: {
      type: string;
      total: string;
      period: number;
    },
  ) {}

  getTransactions(): Transaction[] {
    if (!this.split) {
      return [this];
    }

    const splitTimes = this.split.period;


    return [];
  }

  buildTransactions(): void {}
}

export class CreateTransactionUseCase implements IUseCase {
  public constructor() {}

  async execute(data: Input): Promise<void> {
    console.log('teste');
  }
}
