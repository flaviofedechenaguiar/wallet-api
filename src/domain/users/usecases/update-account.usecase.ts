import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { DomainError } from 'src/support/erros/domain.error';
import { UserRepository } from '../repositories/user.repository';
import { UpdateAccountInput } from '../dtos/update-account.dto';
import { UpdateAccountData } from '../dtos/update-account-data.dto';
import { Inject } from '@nestjs/common';

export class UserUpdateAccountUseCase implements IUseCase {
  public constructor(
    private userRepository: UserRepository,
    @Inject(IEncrypt) private encrypt: IEncrypt,
  ) {}

  async execute(data: UpdateAccountInput): Promise<void> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    const isSameUser = userWithSameEmail?.id === data.id;
    if (userWithSameEmail && !isSameUser)
      throw new DomainError('Email already existis.');

    let encryptedPassword = undefined;
    if (data.password)
      encryptedPassword = await this.encrypt.hash(data.password);

    this.userRepository.update(
      data.id,
      new UpdateAccountData(data.name, data.email, encryptedPassword),
    );
  }
}
