import { UserData } from '../data/user.data';

export interface IUserRepository {
  add(data: UserData): Promise<UserData>;
  update(id: number, data: UserData): Promise<UserData>;
  findById(id: number): Promise<UserData>;
  findByEmail(email: string): Promise<UserData | null>;
  delete(id: number): Promise<void>;
}
