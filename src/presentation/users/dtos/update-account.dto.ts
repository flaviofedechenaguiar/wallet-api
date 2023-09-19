import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Match } from 'src/nestjs/match.decorator';

export class UpdateAccountRequest {
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
