import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  WalletCreateUseCase,
  WalletUpdateUseCase,
} from 'src/domain/wallets/usecases';
import { CreateWalletRequest } from '../dtos/create-wallet.dto';
import { UpdateWalletRequest } from '../dtos/update-wallet.dto';
import { AuthGuard } from 'src/presentation/users/guards/auth.guard';

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly walletCreateUseCase: WalletCreateUseCase,
    private readonly walletUpdateUseCase: WalletUpdateUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async store(
    @Request() request: Request,
    @Body() body: CreateWalletRequest,
  ): Promise<void> {
    const userId = request['userId'];
    await this.walletCreateUseCase.execute({
      userId: +userId,
      description: body.description,
      amount: body.amount,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() request: Request,
    @Body() body: UpdateWalletRequest,
  ): Promise<void> {
    const userId = request['userId'];
    await this.walletUpdateUseCase.execute({
      id: +id,
      description: body.description,
      amount: body.amount,
      userId: userId,
    });
  }
}
