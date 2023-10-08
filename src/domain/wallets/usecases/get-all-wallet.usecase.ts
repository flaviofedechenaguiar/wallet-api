import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { WalletRepository } from '../repositories/wallet.repository';
import { DomainError } from 'src/support/erros/domain.error';
import { Injectable } from '@nestjs/common';
import { WalletData } from '../dtos/wallet-data';

@Injectable()
export class WalletGetAllUseCase implements IUseCase {
  public constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number): Promise<WalletData[]> {
    const wallet = await this.walletRepository.queryAllByUserId(userId);
    if (!wallet) throw new DomainError('carteira', 'Carteira não encontrada');

    return wallet;
  }
}
