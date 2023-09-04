import { UserData } from '../../data/user.data';
import { UpdateUserData } from './update-user-data';

export interface IUserRepository {
  add(data: UserData): Promise<UserData>;
  update(id: number, data: UpdateUserData): Promise<UserData>;
  findById(id: number): Promise<UserData>;
  findByEmail(email: string): Promise<UserData | null>;
  delete(id: number): Promise<void>;
}
