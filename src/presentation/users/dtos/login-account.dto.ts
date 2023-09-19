import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginAccountRequest {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;
}

export type LoginAccountResponse = {
  name: string;
  email: string;
  token: string;
  hasWallet: boolean;
};
