import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAccountRequest {
  @IsEmail({}, { message: 'O email inserido não é válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password: string;
}

export type LoginAccountResponse = {
  name: string;
  email: string;
  token: string;
  hasWallet: boolean;
};
