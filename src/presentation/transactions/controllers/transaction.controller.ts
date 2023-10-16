import {
  Body,
  Controller,
  HttpCode,
  Post,
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

@Controller('transactions')
export class TransactionController {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

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
  @Post()
  async index(
    @Request() request: Request,
    @Query('month') month,
  ): Promise<any> {
    const date = new Date(month);
  }
}
