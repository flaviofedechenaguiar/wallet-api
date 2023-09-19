import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWalletRequest {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
