import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
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
  final_amount: number;

  @NotEquals(0, { message: 'O valor deve não pode ser 0(zero)' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  @IsNumber()
  initial_value: number;

  @IsNumber({}, { message: 'O ID da carteira deve ser um número' })
  wallet_id: number;
}

class UpdatePiggyRequest {
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
  final_amount: number;
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

    if (foundedWallet.amount < body.initial_value) {
      throw new DomainError(
        'wallet_id',
        'Carteira não possui saldo suficiente',
      );
    }

    const createdPiggy = await this.piggyBankRepository.save({
      name: body.name,
      final_amount: body.final_amount,
      amount: body.initial_value,
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

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Put(':id')
  async update(
    @Request() request: Request,
    @Param('id') id: string,
    @Body() body: UpdatePiggyRequest,
  ): Promise<void> {
    const userId = +request['userId'];
    const foundedPiggy = await this.piggyBankRepository.findOne({
      where: { id: +id, user_id: userId },
    });

    if (!foundedPiggy) throw new DomainError('id', 'Porquinho não encontrado');

    const foundedPiggyWithSameName = await this.piggyBankRepository.findOne({
      where: { name: body.name, user_id: userId },
    });

    const alreadyPiggyWithSameName =
      foundedPiggyWithSameName &&
      foundedPiggyWithSameName?.id !== foundedPiggy.id;

    if (alreadyPiggyWithSameName) {
      throw new DomainError('name', 'Porquinho presente com mesmo nome');
    }

    await this.piggyBankRepository.save({
      id: +id,
      name: body.name,
      final_date: body.final_date,
      final_amount: body.final_amount,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async delete(
    @Request() request: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = +request['userId'];

    const foundedPiggy = await this.piggyBankRepository.findOne({
      where: { id: +id, user_id: userId },
    });

    if (!foundedPiggy) throw new DomainError('id', 'Porquinho não econtrado');

    if (foundedPiggy.amount > 0)
      throw new DomainError(
        'id',
        'Faça a transferência de todo o valor para que possa ser deletedo o porquinho',
      );

    await this.piggyBankRepository.delete({ id: +id });
  }
}
