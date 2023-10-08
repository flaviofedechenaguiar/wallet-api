import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IJWTAuthentication } from 'src/domain/contracts/jwt-authentication';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { UserRepository } from '../repositories/user.repository';
import { DomainError } from 'src/support/erros/domain.error';
import { LoginInput, LoginOutput } from '../dtos/sign-in-account.dto';
import { WalletRepository } from 'src/domain/wallets/repositories/wallet.repository';
import { Inject } from '@nestjs/common';

export class UserLoginUseCase implements IUseCase {
  public constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    @Inject(IEncrypt) private encrypt: IEncrypt,
    @Inject(IJWTAuthentication) private authentication: IJWTAuthentication,
  ) {}

  async execute(data: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new DomainError('Email/Password incorrect.');
    const isCorrectPassword = await this.encrypt.compare(
      data.password,
      user.password,
    );

    if (!isCorrectPassword) throw new DomainError('Email/Password incorrect.');
    const token = await this.authentication.sign({ id: user.id });

    const hasWallet = Boolean(
      await this.walletRepository.findByUserId(user.id),
    );

    return { token, name: user.name, email: user.email, hasWallet };
  }
}
