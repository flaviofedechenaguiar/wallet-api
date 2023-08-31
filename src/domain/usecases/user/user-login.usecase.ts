import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IJWTAuthentication } from 'src/domain/contracts/jwt-authentication';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { UserLoginData } from 'src/domain/data/user-login.data';
import { IUserRepository } from 'src/domain/repositories/user.repository';

type Output = {
  token: string;
  name: string;
  email: string;
};

export class UserLoginUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private encrypt: IEncrypt,
    private authentication: IJWTAuthentication,
  ) {}

  async execute(data: UserLoginData): Promise<Output> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error('Email/Password incorrect.');
    const isCorrectPassword = await this.encrypt.compare(
      data.password,
      user.password,
    );

    if (!isCorrectPassword) throw new Error('Email/Password incorrect.');
    const token = await this.authentication.sign({ id: user.id });

    return { token, name: user.name, email: user.email };
  }
}
