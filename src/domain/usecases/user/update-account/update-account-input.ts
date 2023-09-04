import { User } from 'src/domain/entities/user.entity';

export class UpdateAccountInput {
  public constructor(
    public id: number,
    public name: string,
    public email: string,
    public password?: string,
  ) {}

  public mapToEntity(): User {
    return new User(this.name, this.email, this.password);
  }
}
