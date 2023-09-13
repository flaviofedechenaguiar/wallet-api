import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  UserCreateAccountUseCase,
  UserDeleteUseCase,
  UserGetUseCase,
  UserLoginUseCase,
} from './domain/usecases/user';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Match } from './nestjs/match.decorator';
import { UserData } from './domain/data/user.data';
import { AuthGuard } from './auth.guard';
import { CreateAccountInput } from './domain/usecases/user/create-account/create-account-input';
import { UserUpdateAccountUseCase } from './domain/usecases/user/update-account';
import { UpdateAccountInput } from './domain/usecases/user/update-account/update-account-input';
import { WalletCreateUseCase } from './domain/usecases/wallet/wallet-create.usecase';
import { WalletUpdateUseCase } from './domain/usecases/wallet/wallet-update';

class StoreRequest {
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

class UpdateRequest {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @Match('password')
  confirm_password: string;
}

class LoginRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

@Controller('users')
export class AppController {
  constructor(
    private readonly userUpdateAccountUseCase: UserUpdateAccountUseCase,
    private readonly userCreateAccountUseCase: UserCreateAccountUseCase,
    private readonly userLoginUseCase: UserLoginUseCase,
    private readonly userDeleteUseCase: UserDeleteUseCase,
    private readonly userGetUseCase: UserGetUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async index(@Request() request: Request): Promise<any> {
    const userId = request['userId'];
    const result = await this.userGetUseCase.execute(userId);
    return { name: result.name, email: result.email };
  }

  @HttpCode(201)
  @Post()
  async store(@Body() body: StoreRequest): Promise<void> {
    const input = new CreateAccountInput(body.name, body.email, body.password);
    await this.userCreateAccountUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Put()
  async update(
    @Request() request: Request,
    @Body() body: UpdateRequest,
  ): Promise<void> {
    const userId = request['userId'];
    const input = new UpdateAccountInput(
      +userId,
      body.name,
      body.email,
      body.password,
    );
    await this.userUpdateAccountUseCase.execute(input);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginRequest): Promise<any> {
    const result = await this.userLoginUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return {
      name: result.name,
      email: result.email,
      token: result.token,
      hasWallet: result.hasWallet,
    };
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete()
  async destroy(@Request() request: Request): Promise<void> {
    const userId = request['userId'];
    await this.userDeleteUseCase.execute(+userId);
  }
}
// ==============================

class StoreWalletRequest {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

class UpdateWalletRequest {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

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
    @Body() body: StoreWalletRequest,
  ): Promise<void> {
    const userId = request['userId'];
    await this.walletCreateUseCase.execute({
      userId: userId,
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
