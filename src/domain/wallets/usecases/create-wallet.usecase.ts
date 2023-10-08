import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IBuildSlug } from 'src/domain/contracts/build-slug';
import { CreateWalletInput } from '../dtos/create-wallet.dto';
import { WalletRepository } from '../repositories/wallet.repository';
import { DomainError } from 'src/support/erros/domain.error';
import { Inject } from '@nestjs/common';

export class WalletCreateUseCase implements IUseCase {
  public constructor(
    private readonly walletRepository: WalletRepository,
    @Inject(IBuildSlug) private readonly buildSlug: IBuildSlug,
  ) {}

  async execute(data: CreateWalletInput): Promise<void> {
    const slug = this.buildSlug.build(data.description);

    const walletWithSameSlug = await this.walletRepository.findBySlugAndUserId(
      slug,
      data.userId,
    );
    if (walletWithSameSlug) throw new DomainError('Wallet already exists.');

    this.walletRepository.create({
      userId: data.userId,
      description: data.description,
      slug,
      amount: data.amount,
    });
  }
}
