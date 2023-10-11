import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateAccountInput } from 'src/domain/users/dtos/create-account.dto';
import { CreateAccountRequest } from '../dtos/create-account.dto';
import { AuthGuard } from '../guards/auth.guard';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from 'src/nestjs/match.decorator';

class StoreTransactionInput {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirm_password: string;
}

@Controller('transactions')
export class TransactionController {
  constructor() {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async store(@Body() body: CreateAccountRequest): Promise<void> {
    const input = new CreateAccountInput(body.name, body.email, body.password);
    await this.userCreateAccountUseCase.execute(input);
  }
}
