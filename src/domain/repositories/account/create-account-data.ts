import { User } from 'src/domain/entities/user.entity';

export class CreateAccountData {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static mapFromEntity(user: User): CreateAccountData {
    return new CreateAccountData(user.name, user.email, user.password);
  }
}
