import { Controller, Get, HttpCode, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/presentation/users/guards/auth.guard';
import { CreateTransactionUseCase } from 'src/domain/transactions/usecases/create-transaction.usecase';
import { Between, DataSource, LessThan, MoreThan } from 'typeorm';
import { TransactionEntity } from 'src/domain/transactions/models/transaction.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { SQLiteWalletEntity } from 'src/domain/wallets/models/wallet.model';

@Controller('main')
export class MainController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Get()
  async main(@Request() request: Request): Promise<any> {
    const userId = request['userId'];

    const walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);
    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);
    const wallets = await walletRepository.find({
      where: { user_id: userId },
    });

    const totalWallets = wallets.reduce((accumulator, wallet) => {
      return (accumulator += wallet.amount);
    }, 0);

    const date = new Date();

    const inicioDoMes = new Date(date.getFullYear(), date.getMonth());
    const fimDoMes = new Date(
      inicioDoMes.getFullYear(),
      inicioDoMes.getMonth() + 1,
      0,
    );

    console.log({ inicioDoMes, fimDoMes });

    const recipesData = await Promise.all(
      wallets.map(async (wallet) => {
        return await transactionRepository.find({
          where: {
            wallet_id: wallet.id,
            date: Between(inicioDoMes, fimDoMes),
            amount: MoreThan(0),
          },
        });
      }),
    );

    const recipes = recipesData.reduce((firstAccumulator, transactions) => {
      return (firstAccumulator += transactions.reduce(
        (secondAccumulator, transaction) => {
          return (secondAccumulator += transaction.amount);
        },
        0,
      ));
    }, 0);

    const expansivesData = await Promise.all(
      wallets.map(async (wallet) => {
        return await transactionRepository.find({
          where: {
            wallet_id: wallet.id,
            date: Between(inicioDoMes, fimDoMes),
            amount: LessThan(0),
          },
        });
      }),
    );

    const expansives = expansivesData.reduce(
      (firstAccumulator, transactions) => {
        return (firstAccumulator += transactions.reduce(
          (secondAccumulator, transaction) => {
            return (secondAccumulator += transaction.amount);
          },
          0,
        ));
      },
      0,
    );

    return {
      total: totalWallets,
      receitas: recipes,
      despesas: expansives,
    };
  }
}