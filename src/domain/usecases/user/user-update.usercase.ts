import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { UserData } from 'src/domain/data/user.data';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class UserUpdateUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private encrypt: IEncrypt,
  ) {}

  async execute(data: UserData): Promise<void> {
    data.mapToEntity();

    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    const isSameUser = userWithSameEmail.id === data.id;
    if (userWithSameEmail && !isSameUser)
      throw new Error('Email already existis.');

    let encryptedPassword = undefined;
    if (data.password)
      encryptedPassword = await this.encrypt.hash(data.password);

    this.userRepository.update(
      data.id,
      new UserData(data.name, data.email, encryptedPassword),
    );
  }
}
