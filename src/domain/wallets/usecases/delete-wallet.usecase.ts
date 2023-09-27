import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { WalletRepository } from '../repositories/wallet.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletDeleteUseCase implements IUseCase {
  public constructor(private walletRepository: WalletRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    await this.walletRepository.delete(id, userId);
  }
}
