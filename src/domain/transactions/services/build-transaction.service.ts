type TransactionInput = {
  description: string;
  date: Date;
  amount: number;
  status: string;
  note: string;
  split?: { type: string; total: number; period: number };
};

class Transactions {
  private constructor(
    public readonly description: string,
    public readonly date: Date,
    public readonly amount: number,
    public readonly status: string,
    public readonly note: string, // public readonly split?: { //   type: string; //   total: string; //   period: number; // },
  ) {}
}

class BuildTransactionsService {
  build() {}
}
