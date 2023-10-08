import { IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from 'src/nestjs/match.decorator';

export class CreateAccountRequest {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio' })
  name: string;

  @IsEmail({}, { message: 'O email inserido não é válido' })
  email: string;

  @IsNotEmpty({ message: 'O campo senha não pode estar vazio' })
  password: string;

  @IsNotEmpty({
    message: 'O campo de confirmação de senha não pode estar vazio',
  })
  @Match('password', {
    message: 'A confirmação de senha deve ser igual à senha',
  })
  confirm_password: string;
}
