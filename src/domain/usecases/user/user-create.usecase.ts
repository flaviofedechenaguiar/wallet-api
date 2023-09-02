import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { UserData } from 'src/domain/data/user.data';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class UserCreateUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private encrypt: IEncrypt,
  ) {}

  async execute(data: UserData): Promise<void> {
    data.mapToEntity();

    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    if (userWithSameEmail) throw new Error('Email already existis.');

    const encryptedPassword = await this.encrypt.hash(data.password);
    this.userRepository.add(
      new UserData(data.name, data.email, encryptedPassword),
    );
  }
}
