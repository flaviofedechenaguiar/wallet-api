import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet-repository';
import { IBuildSlug } from 'src/domain/contracts/build-slug';
import { UpdateWalletInput } from './update-wallet-input';

export class WalletUpdateUseCase implements IUseCase {
  public constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly buildSlug: IBuildSlug,
  ) {}

  async execute(data: UpdateWalletInput): Promise<void> {
    const slug = this.buildSlug.build(data.description);

    const foundWallet = await this.walletRepository.findBySlugAndUserId(
      slug,
      data.userId,
    );

    const hasOtherWalletWithSameSlug =
      foundWallet && data.id !== foundWallet.id;
    if (hasOtherWalletWithSameSlug) throw new Error('Wallet already exists.');

    await this.walletRepository.update(data.id, {
      description: data.description,
      slug,
      amount: data.amount,
    });
  }
}
