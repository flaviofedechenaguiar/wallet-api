import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionEntity } from '../models/transaction.model';

export class TransactionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  private transaction = this.dataSource.getRepository(TransactionEntity);

  async create(
    data: Transaction[],
    walletId: number,
    categoryId: number,
  ): Promise<void> {
    await Promise.all(
      data.map(async (transaction) => {
        return await this.transaction.save({
          description: transaction.description,
          transaction_code: transaction.transactionCode,
          date: transaction.date,
          amount: transaction.amount,
          note: transaction.note,
          status: transaction.status,
          walletId: walletId,
          category_id: categoryId,
        });
      }),
    );
  }
}
