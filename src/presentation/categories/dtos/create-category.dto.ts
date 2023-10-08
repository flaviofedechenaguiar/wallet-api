import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryRequest {
  @IsNotEmpty({ message: 'A descrição não pode estar vazia' })
  @IsString({ message: 'A descrição deve ser uma string' })
  description: string;

  @IsNotEmpty({ message: 'O ID do ícone não pode estar vazio' })
  @IsNumber({}, { message: 'O ID do ícone deve ser um número' })
  icon_id: number;
}
