import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { BuildTransactions } from '../services/build-transaction.service';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionRepository } from '../repositories/transaction.repository';

type Input = {
  description: string;
  date: Date;
  amount: number;
  note?: string;
  status: string;
  installment: number;
  period: number;
  walletId: number;
  categoryId: number;
};

@Injectable()
export class CreateTransactionUseCase implements IUseCase {
  public constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(data: Input): Promise<void> {
    const transactions = BuildTransactions.build({
      description: data.description,
      date: data.date,
      note: data.note,
      amount: data.amount,
      period: data.period,
      status: TransactionStatus[data.status],
      installment: data.installment,
    });

    this.transactionRepository.create(
      transactions,
      data.walletId,
      data.categoryId,
    );
  }
}
