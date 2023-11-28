import { IEncrypt } from 'src/domain/contracts/encrypt.contracts';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { CreateAccountInput } from '../dtos/create-account.dto';
import { UserRepository } from '../repositories/user.repository';
import { DomainError } from 'src/support/erros/domain.error';
import { CreateAccountData } from '../dtos/create-account-data.dto';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/domain/categories/models/category.model';
import { IconEntity } from 'src/domain/categories/models/icon.model';

export class UserCreateAccountUseCase implements IUseCase {
  public constructor(
    private userRepository: UserRepository,
    @Inject(IEncrypt) private encrypt: IEncrypt,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  private categoryRepository = this.dataSource.getRepository(CategoryEntity);
  private iconRepository = this.dataSource.getRepository(IconEntity);

  async execute(data: CreateAccountInput): Promise<void> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    if (userWithSameEmail) throw new DomainError('email', 'Email já existe');

    const encryptedPassword = await this.encrypt.hash(data.password);

    const createdUser = await this.userRepository.create(
      new CreateAccountData(data.name, data.email, encryptedPassword),
    );

    const hasIcon = await this.iconRepository.findOne({ where: { id: 1 } });
    if (!hasIcon)
      await this.iconRepository.save({
        id: 1,
        description: 'Wallet',
        data: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path></svg>',
      });

    await this.categoryRepository.save({
      description: 'transaction',
      slug: 'transaction',
      user_id: createdUser.id,
      icon_id: 1,
    });
  }
}
