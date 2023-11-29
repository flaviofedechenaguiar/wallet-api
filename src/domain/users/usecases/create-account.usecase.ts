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

export class UserCreateAccountUseCase implements IUseCase {
  public constructor(
    private userRepository: UserRepository,
    @Inject(IEncrypt) private encrypt: IEncrypt,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  private categoryRepository = this.dataSource.getRepository(CategoryEntity);

  async execute(data: CreateAccountInput): Promise<void> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    if (userWithSameEmail) throw new DomainError('email', 'Email já existe');

    const encryptedPassword = await this.encrypt.hash(data.password);

    const createdUser = await this.userRepository.create(
      new CreateAccountData(data.name, data.email, encryptedPassword),
    );

    this.createCategory(createdUser.id);
  }

  private async createCategory(userId: number) {
    const categories = [
      {
        description: 'Transaction',
        slug: 'transaction',
        user_id: userId,
        icon_id: 1,
      },
      {
        description: 'Alimentação',
        slug: 'alimentacao',
        user_id: userId,
        icon_id: 1350,
      },
      {
        description: 'Moradia',
        slug: 'moradia',
        user_id: userId,
        icon_id: 1816,
      },
      {
        description: 'Transporte',
        slug: 'transporte',
        user_id: userId,
        icon_id: 1351,
      },
      {
        description: 'Saúde',
        slug: 'saude',
        user_id: userId,
        icon_id: 1815,
      },
      {
        description: 'Educação',
        slug: 'educacao',
        user_id: userId,
        icon_id: 1353,
      },
      {
        description: 'Lazer',
        slug: 'lazer',
        user_id: userId,
        icon_id: 1356,
      },
      {
        description: 'Vestuário',
        slug: 'vestuario',
        user_id: userId,
        icon_id: 1814,
      },
      {
        description: 'Outros',
        slug: 'outros',
        user_id: userId,
        icon_id: 1459,
      },
    ];

    await Promise.all(
      categories.map(async (category) => {
        await this.categoryRepository.save(category);
      }),
    );
  }
}
