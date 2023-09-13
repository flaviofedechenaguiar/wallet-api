import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet-repository';
import { IBuildSlug } from 'src/domain/contracts/build-slug';
import { CreateWalletInput } from './wallet-create/create-wallet-input';

export class WalletCreateUseCase implements IUseCase {
  public constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly buildSlug: IBuildSlug,
  ) {}

  async execute(data: CreateWalletInput): Promise<void> {
    const slug = this.buildSlug.build(data.description);

    const walletWithSameSlug = await this.walletRepository.findBySlugAndUserId(
      slug,
      data.userId,
    );
    if (walletWithSameSlug) throw new Error('Wallet already exists.');

    this.walletRepository.create({
      userId: data.userId,
      description: data.description,
      slug,
      amount: data.amount,
    });
  }
}
