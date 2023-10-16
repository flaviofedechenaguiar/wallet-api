import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { BuildTransactions } from '../services/build-transaction.service';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WalletRepository } from 'src/domain/wallets/repositories/wallet.repository';

type Input = {
  description: string;
  date: Date;
  amount: number;
  note?: string;
  status: TransactionStatus;
  installment: number;
  period: number;
  walletId: number;
  categoryId: number;
  userId: number;
};

@Injectable()
export class CreateTransactionUseCase implements IUseCase {
  public constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(data: Input): Promise<void> {
    const transactions = BuildTransactions.build({
      description: data.description,
      date: data.date,
      note: data.note,
      amount: data.amount,
      period: data.period,
      status: data.status,
      installment: data.installment,
    });

    const wallet = await this.walletRepository.findByIdAndUserId(
      data.walletId,
      data.userId,
    );

    const totalTransactions = transactions.reduce(
      (acc, current) => acc + current.amount,
      0,
    );

    const totalWallet = wallet.amount + totalTransactions;

    await this.transactionRepository.create(
      transactions,
      data.walletId,
      data.categoryId,
    );

    await this.walletRepository.update(wallet.id, {
      ...wallet,
      amount: totalWallet,
    });
  }
}
