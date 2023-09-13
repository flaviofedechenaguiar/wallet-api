import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IJWTAuthentication } from 'src/domain/contracts/jwt-authentication';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';
import { LoginOutput } from './login-output';
import { LoginInput } from './login-input';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet-repository';

export class UserLoginUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private walletRepository: IWalletRepository,
    private encrypt: IEncrypt,
    private authentication: IJWTAuthentication,
  ) {}

  async execute(data: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error('Email/Password incorrect.');
    const isCorrectPassword = await this.encrypt.compare(
      data.password,
      user.password,
    );

    if (!isCorrectPassword) throw new Error('Email/Password incorrect.');
    const token = await this.authentication.sign({ id: user.id });

    const hasWallet = !!(await this.walletRepository.findByUserId(user.id));

    return { token, name: user.name, email: user.email, hasWallet };
  }
}
