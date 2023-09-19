import { IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from 'src/nestjs/match.decorator';

export class CreateAccountRequest {
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
