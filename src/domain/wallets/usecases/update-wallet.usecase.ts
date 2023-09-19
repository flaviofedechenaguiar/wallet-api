import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IBuildSlug } from 'src/domain/contracts/build-slug';
import { WalletRepository } from '../repositories/wallet.repository';
import { UpdateWalletInput } from '../dtos/update-wallet.dto';
import { DomainError } from 'src/support/erros/domain.error';

export class WalletUpdateUseCase implements IUseCase {
  public constructor(
    private readonly walletRepository: WalletRepository,
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
    if (hasOtherWalletWithSameSlug)
      throw new DomainError('Wallet already exists.');

    await this.walletRepository.update(data.id, {
      description: data.description,
      slug,
      amount: data.amount,
    });
  }
}
