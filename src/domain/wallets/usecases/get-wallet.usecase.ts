import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { WalletRepository } from '../repositories/wallet.repository';
import { DomainError } from 'src/support/erros/domain.error';
import { GetWalletInput } from '../dtos/get-wallet.dto';
import { Injectable } from '@nestjs/common';
import { WalletData } from '../dtos/wallet-data';

@Injectable()
export class WalletGetUseCase implements IUseCase {
  public constructor(private readonly walletRepository: WalletRepository) {}

  async execute({ id, userId }: GetWalletInput): Promise<WalletData> {
    const wallet = await this.walletRepository.findByIdAndUserId(id, userId);
    if (!wallet) throw new DomainError('Wallet not found');

    return wallet;
  }
}
