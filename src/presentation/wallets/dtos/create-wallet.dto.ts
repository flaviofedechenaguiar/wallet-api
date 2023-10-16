import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWalletRequest {
  @IsNotEmpty({ message: 'A descrição não pode estar vazia' })
  description: string;

  @IsNotEmpty({ message: 'O valor não pode estar vazio' })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  amount: number;
}
