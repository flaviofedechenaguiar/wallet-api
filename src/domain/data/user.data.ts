import { User } from '../entities/user.entity';

export class UserData {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public id?: number,
  ) {}

  public mapToEntity(): User {
    return new User(this.name, this.email, this.password || '');
  }
}
