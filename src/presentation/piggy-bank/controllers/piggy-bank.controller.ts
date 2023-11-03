import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  NotEquals,
} from 'class-validator';
import { PiggyBankEntity } from 'src/domain/piggy-bank/models/piggy-bank.model';
import { TransactionStatus } from 'src/domain/transactions/enums/transaction-status.enum';
import { TransactionEntity } from 'src/domain/transactions/models/transaction.model';
import { SQLiteWalletEntity } from 'src/domain/wallets/models/wallet.model';
import { AuthGuard } from 'src/presentation/users/guards/auth.guard';
import { DomainError } from 'src/support/erros/domain.error';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

class StorePiggyRequest {
  @IsNotEmpty({ message: 'A nome é obrigatória' })
  name: string;

  @IsDateString(
    {},
    { message: 'A data final deve ser um objeto de data válido' },
  )
  final_date: Date;

  @NotEquals(0, { message: 'O valor deve não pode ser 0(zero)' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  @IsNumber()
  amount: number;

  @NotEquals(0, { message: 'O valor deve não pode ser 0(zero)' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  @IsNumber()
  initial_value: number;

  @IsNumber({}, { message: 'O ID da carteira deve ser um número' })
  wallet_id: number;
}

@Controller('piggy')
export class PiggyBankController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private piggyBankRepository = this.dataSource.getRepository(PiggyBankEntity);
  private walletRepository = this.dataSource.getRepository(SQLiteWalletEntity);
  private transactionRepository =
    this.dataSource.getRepository(TransactionEntity);

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async store(
    @Request() request: Request,
    @Body() body: StorePiggyRequest,
  ): Promise<void> {
    const userId = +request['userId'];

    const foundedWallet = await this.walletRepository.findOne({
      where: { id: body.wallet_id },
    });

    const foundedPiggy = await this.piggyBankRepository.findOne({
      where: { name: body.name, user_id: userId },
    });

    if (foundedPiggy)
      throw new DomainError('name', 'Porquinho presente com mesmo nome');

    const createdPiggy = await this.piggyBankRepository.save({
      name: body.name,
      amount: body.amount,
      final_date: body.final_date,
      user_id: userId,
    });

    await this.transactionRepository.save({
      description: `Transferencia recebida de ${foundedWallet.description}`,
      amount: body.initial_value,
      date: new Date(),
      status: TransactionStatus.PAIED,
      piggy_bank_id: createdPiggy.id,
      category_id: 1,
      transaction_code: uuid(),
    });

    const transactionAmountWallet = body.initial_value;
    await this.transactionRepository.save({
      description: `Transferencia para ${body.name}`,
      amount: transactionAmountWallet * -1,
      date: new Date(),
      status: TransactionStatus.PAIED,
      wallet_id: body.wallet_id,
      category_id: 1,
      transaction_code: uuid(),
    });

    await this.walletRepository.save({
      ...foundedWallet,
      amount: foundedWallet.amount - transactionAmountWallet,
    });
  }
}
