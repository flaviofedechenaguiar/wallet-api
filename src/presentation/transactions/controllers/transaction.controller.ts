import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/presentation/users/guards/auth.guard';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  NotEquals,
} from 'class-validator';
import { CreateTransactionUseCase } from 'src/domain/transactions/usecases/create-transaction.usecase';
import { TransactionStatus } from 'src/domain/transactions/enums/transaction-status.enum';
import { Between, DataSource, In, LessThan, MoreThan } from 'typeorm';
import { TransactionEntity } from 'src/domain/transactions/models/transaction.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { SQLiteWalletEntity } from 'src/domain/wallets/models/wallet.model';
import { DomainError } from 'src/support/erros/domain.error';
import {
  buildDate,
  getFirstAndLastDateOfMonth,
} from 'src/utils/GetFirstAndLastDateOfMonth';

class StoreTransactionRequest {
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsDateString({}, { message: 'A data deve ser um objeto de data válido' })
  date: Date;

  @NotEquals(0, { message: 'O valor deve não pode ser 0(zero)' })
  @IsNumber()
  amount: number;

  @IsString({ message: 'A nota deve ser uma string' })
  @IsOptional()
  note?: string;

  @IsString({ message: 'O status deve ser uma string' })
  status: string;

  @IsNumber({}, { message: 'A parcela deve ser um número' })
  installment: number;

  @IsPositive({ message: 'O período deve ser um número positivo' })
  @IsNumber({}, { message: 'O período deve ser um número' })
  period: number;

  @IsNumber({}, { message: 'O ID da carteira deve ser um número' })
  walletId: number;

  @IsNumber({}, { message: 'O ID da categoria deve ser um número' })
  categoryId: number;
}

class UpdateTransactionRequest {
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsDateString({}, { message: 'A data deve ser um objeto de data válido' })
  date: Date;

  @NotEquals(0, { message: 'O valor deve não pode ser 0(zero)' })
  @IsNumber()
  amount: number;

  @IsString({ message: 'A nota deve ser uma string' })
  @IsOptional()
  note?: string;

  @IsString({ message: 'O status deve ser uma string' })
  status: string;

  @IsNumber({}, { message: 'O ID da carteira deve ser um número' })
  walletId: number;

  @IsNumber({}, { message: 'O ID da categoria deve ser um número' })
  categoryId: number;
}

@Controller('transactions')
export class TransactionController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async store(
    @Request() request: Request,
    @Body() body: StoreTransactionRequest,
  ): Promise<any> {
    const userId = request['userId'];

    const tryOption = <T extends object>(
      _enum: T,
      _value: string,
    ): T[keyof T] => {
      const key = Object.entries(_enum).find(
        ([_, value]) => value === _value,
      )?.[0];
      if (!key) throw new Error('Invalid value');
      return (_enum as Record<number | string, any>)[key] as T[keyof T];
    };

    await this.createTransactionUseCase.execute({
      ...body,
      status: tryOption(TransactionStatus, body.status),
      userId: +userId,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async index(
    @Request() request: Request,
    @Query('type') type: string,
    @Query('wallet_id') walletId: string,
    @Query('month') month: string,
  ): Promise<any> {
    const userId = +request['userId'];
    const walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);

    const filterByWallet = walletId ? +walletId : null;
    const filterByType = ['receita', 'despesa'].includes(type) ? type : null;
    const filterByMonth = !!month;

    const wallets = await walletRepository.find({
      where: {
        user_id: userId,
        ...(filterByWallet && { id: filterByWallet }),
      },
    });

    if (wallets.length == 0) {
      throw new DomainError('wallet_id', 'Carteira não encontrada');
    }

    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);

    let inicioDoMes = null;
    let fimDoMes = null;
    if (filterByMonth) {
      const date = buildDate(month);
      const { firstDate, lastDate } = getFirstAndLastDateOfMonth(date);
      inicioDoMes = firstDate;
      fimDoMes = lastDate;
    }

    const walletIds = wallets.map((wallet) => wallet.id);
    const transactions = await transactionRepository.find({
      where: {
        wallet_id: In(walletIds),
        ...(filterByMonth && {
          date: Between(inicioDoMes, fimDoMes),
        }),
        ...(filterByType && {
          amount: type == 'receita' ? MoreThan(0) : LessThan(0),
        }),
      },
      relations: ['category.icon'],
    });

    return transactions;
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':walletId/:id')
  async show(
    @Request() request: Request,
    @Param('walletId') walletId: string,
    @Param('id') id: string,
  ): Promise<any> {
    const userId = +request['userId'];
    const walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);
    const isWalletFromUser = await walletRepository.findOne({
      where: { id: +walletId, user_id: userId },
    });

    if (!isWalletFromUser) {
      throw new DomainError('wallet_id', 'Carteira não encontrada');
    }

    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);

    const transaction = await transactionRepository.findOne({
      where: {
        id: +id,
        wallet_id: +walletId,
      },
      relations: ['category.icon', 'wallet'],
    });

    return transaction;
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':walletId/:id')
  async delete(
    @Request() request: Request,
    @Param('walletId') walletId: string,
    @Param('id') id: string,
  ): Promise<any> {
    const userId = +request['userId'];
    const walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);
    const walletFromUser = await walletRepository.findOne({
      where: { id: +walletId, user_id: userId },
    });

    if (!walletFromUser) {
      throw new DomainError('wallet_id', 'Carteira não encontrada');
    }

    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);

    const transaction = await transactionRepository.findOne({
      where: {
        id: +id,
        wallet_id: +walletId,
      },
    });

    if (!transaction) return;

    transactionRepository.delete({ id: +id, wallet_id: +walletId });
    const recalculatedAmount = walletFromUser.amount - transaction.amount;
    walletRepository.save({ id: +walletId, amount: recalculatedAmount });
  }

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Put(':walletId/:id')
  async update(
    @Request() request: Request,
    @Param('walletId') walletId: string,
    @Param('id') id: string,
    @Body() body: UpdateTransactionRequest,
  ): Promise<any> {
    const userId = request['userId'];
    const walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);
    const walletFromUser = await walletRepository.findOne({
      where: { id: +walletId, user_id: userId },
    });

    if (!walletFromUser) {
      throw new DomainError('wallet_id', 'Carteira não encontrada');
    }

    const transactionRepository =
      this.dataSource.getRepository(TransactionEntity);

    const foundedTransaction = await transactionRepository.findOne({
      where: { id: +id, wallet_id: +walletId, canUpdate: true },
    });

    if (!foundedTransaction)
      throw new DomainError('id', 'Transação não pode ser atualizada');

    if (foundedTransaction.amount !== body.amount) {
      const correctedAmount =
        walletFromUser.amount - foundedTransaction.amount + body.amount;
      walletRepository.save({
        id: +walletId,
        amount: correctedAmount,
      });
    }

    await transactionRepository.save({
      id: foundedTransaction.id,
      description: body.description,
      date: body.date,
      amount: body.amount,
      note: body.note,
      status: body.status,
      wallet_id: body.walletId,
      category_id: body.categoryId,
    });
  }
}
