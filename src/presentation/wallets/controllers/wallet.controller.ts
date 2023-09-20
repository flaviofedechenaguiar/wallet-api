import {
  Body,
  Controller,
  Get,
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
import { WalletGetUseCase } from 'src/domain/wallets/usecases/get-wallet.usecase';
import { GetAllWalletOutput } from '../dtos/get-wallet.dto';
import { WalletGetAllUseCase } from 'src/domain/wallets/usecases/get-all-wallet.usecase';
import { GetWalletOutput } from '../dtos/get-all-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly walletCreateUseCase: WalletCreateUseCase,
    private readonly walletUpdateUseCase: WalletUpdateUseCase,
    private readonly walletGetUseCase: WalletGetUseCase,
    private readonly walletGetAllUseCase: WalletGetAllUseCase,
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

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':id')
  async index(
    @Param('id') id: string,
    @Request() request: Request,
  ): Promise<GetWalletOutput> {
    const userId = request['userId'];
    const result = await this.walletGetUseCase.execute({
      id: +id,
      userId: +userId,
    });

    return {
      id: result.id,
      description: result.description,
      slug: result.slug,
      amount: result.amount,
      user_id: result.userId,
    };
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async show(@Request() request: Request): Promise<GetAllWalletOutput> {
    const userId = request['userId'];
    const results = await this.walletGetAllUseCase.execute(+userId);

    return results.map((wallet) => ({
      id: wallet.id,
      description: wallet.description,
      slug: wallet.slug,
      amount: wallet.amount,
      user_id: wallet.userId,
    }));
  }
}
