import { User } from 'src/domain/entities/user.entity';

export class CreateAccountInput {
  public constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  public mapToEntity(): User {
    return new User(this.name, this.email, this.password);
  }
}
