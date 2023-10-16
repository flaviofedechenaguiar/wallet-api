import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Match } from 'src/nestjs/match.decorator';

export class UpdateAccountRequest {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio' })
  name: string;

  @IsEmail({}, { message: 'O email inserido não é válido' })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password: string;

  @Match('password', {
    message: 'A confirmação de senha deve ser igual à senha',
  })
  confirm_password: string;
}
