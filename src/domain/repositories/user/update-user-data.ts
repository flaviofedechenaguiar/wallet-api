import { User } from 'src/domain/entities/user.entity';

export class UpdateUserData {
  private constructor(
    public name: string,
    public email: string,
    public password?: string,
  ) {}

  static mapFromEntity(user: User): UpdateUserData {
    return new UpdateUserData(user.name, user.email, user.password);
  }
}
