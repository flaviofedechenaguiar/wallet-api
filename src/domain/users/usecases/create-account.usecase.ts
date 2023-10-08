import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { CreateAccountInput } from '../dtos/create-account.dto';
import { UserRepository } from '../repositories/user.repository';
import { DomainError } from 'src/support/erros/domain.error';
import { CreateAccountData } from '../dtos/create-account-data.dto';
import { Inject } from '@nestjs/common';

export class UserCreateAccountUseCase implements IUseCase {
  public constructor(
    private userRepository: UserRepository,
    @Inject(IEncrypt) private encrypt: IEncrypt,
  ) {}

  async execute(data: CreateAccountInput): Promise<void> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    if (userWithSameEmail) throw new DomainError('Email already existis.');

    const encryptedPassword = await this.encrypt.hash(data.password);

    await this.userRepository.create(
      new CreateAccountData(data.name, data.email, encryptedPassword),
    );
  }
}
