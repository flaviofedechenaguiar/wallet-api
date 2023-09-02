import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Optional,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  UserCreateUseCase,
  UserDeleteUseCase,
  UserGetUseCase,
  UserLoginUseCase,
  UserUpdateUseCase,
} from './domain/usecases/user';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Match } from './nestjs/match.decorator';
import { UserData } from './domain/data/user.data';
import { AuthGuard } from './auth.guard';

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
    private readonly userCreateUseCase: UserCreateUseCase,
    private readonly userUpdateUseCase: UserUpdateUseCase,
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
    const input = new UserData(body.name, body.email, body.password);
    await this.userCreateUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Put()
  async update(
    @Request() request: Request,
    @Body() body: UpdateRequest,
  ): Promise<void> {
    const userId = request['userId'];
    const input = new UserData(body.name, body.email, body.password, +userId);
    await this.userUpdateUseCase.execute(input);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginRequest): Promise<any> {
    const result = await this.userLoginUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return { name: result.name, email: result.email, token: result.token };
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete()
  async destroy(@Request() request: Request): Promise<void> {
    const userId = request['userId'];
    await this.userDeleteUseCase.execute(+userId);
  }
}
