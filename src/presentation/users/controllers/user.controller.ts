import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateAccountInput } from 'src/domain/users/dtos/create-account.dto';
import { UpdateAccountInput } from 'src/domain/users/dtos/update-account.dto';
import {
  UserCreateAccountUseCase,
  UserDeleteAccountUseCase,
  UserGetAccountUseCaseCase,
  UserLoginUseCase,
  UserUpdateAccountUseCase,
} from 'src/domain/users/usecases';
import { CreateAccountRequest } from '../dtos/create-account.dto';
import { UpdateAccountRequest } from '../dtos/update-account.dto';
import {
  LoginAccountRequest,
  LoginAccountResponse,
} from '../dtos/login-account.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userCreateAccountUseCase: UserCreateAccountUseCase,
    private readonly userUpdateAccountUseCase: UserUpdateAccountUseCase,
    private readonly userLoginUseCase: UserLoginUseCase,
    private readonly userDeleteAccountUseCase: UserDeleteAccountUseCase,
    private readonly userGetAccountUseCaseCase: UserGetAccountUseCaseCase,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async index(@Request() request: Request): Promise<any> {
    const userId = request['userId'];
    const result = await this.userGetAccountUseCaseCase.execute(userId);
    return { name: result.name, email: result.email };
  }

  @HttpCode(201)
  @Post()
  async store(@Body() body: CreateAccountRequest): Promise<void> {
    const input = new CreateAccountInput(body.name, body.email, body.password);
    await this.userCreateAccountUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Put()
  async update(
    @Request() request: Request,
    @Body() body: UpdateAccountRequest,
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
  async login(
    @Body() body: LoginAccountRequest,
  ): Promise<LoginAccountResponse> {
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
    await this.userDeleteAccountUseCase.execute(+userId);
  }
}
