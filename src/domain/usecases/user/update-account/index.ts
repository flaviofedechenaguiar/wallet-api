import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';
import { UpdateAccountInput } from './update-account-input';
import { UpdateUserData } from 'src/domain/repositories/user/update-user-data';

export class UserUpdateAccountUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private encrypt: IEncrypt,
  ) {}

  async execute(data: UpdateAccountInput): Promise<void> {
    const user = data.mapToEntity();

    const userWithSameEmail = await this.userRepository.findByEmail(user.email);
    const isSameUser = userWithSameEmail?.id === data.id;
    if (userWithSameEmail && !isSameUser)
      throw new Error('Email already existis.');

    if (data.password) {
      const encryptedPassword = await this.encrypt.hash(data.password);
      user.changePassword(encryptedPassword);
    }

    this.userRepository.update(data.id, UpdateUserData.mapFromEntity(user));
  }
}
