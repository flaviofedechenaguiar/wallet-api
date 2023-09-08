import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';
import { CreateAccountInput } from './create-account-input';
import { IAccountRepository } from 'src/domain/repositories/account/account.repository';
import { CreateAccountData } from 'src/domain/repositories/account/create-account-data';

export class UserCreateAccountUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private accountRepository: IAccountRepository,
    private encrypt: IEncrypt,
  ) {}

  async execute(data: CreateAccountInput): Promise<void> {
    const user = data.mapToEntity();
    const userWithSameEmail = await this.userRepository.findByEmail(user.email);
    if (userWithSameEmail) throw new Error('Email already existis.');

    const encryptedPassword = await this.encrypt.hash(data.password);
    user.changePassword(encryptedPassword);

    await this.accountRepository.create(CreateAccountData.mapFromEntity(user));
  }
}
