import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { CreateWalletInput } from './create-wallet-input';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet-repository';
import { IBuildSlug } from 'src/domain/contracts/build-slug';

export class WalletCreateUseCase implements IUseCase {
  public constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly buildSlug: IBuildSlug,
  ) {}

  async execute(data: CreateWalletInput): Promise<void> {
    const slug = this.buildSlug.build(data.description);
    const wallet = await this.walletRepository.findBySlugAndUserId(
      slug,
      data.userId,
    );
    if (wallet) throw new Error('Wallet already existis');

    await this.walletRepository.create({
      description: data.description,
      slug,
      amount: data.amount,
      userId: data.userId,
    });
  }
}
