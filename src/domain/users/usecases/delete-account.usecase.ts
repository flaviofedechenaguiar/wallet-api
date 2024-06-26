import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { UserRepository } from '../repositories/user.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserDeleteAccountUseCase implements IUseCase {
  public constructor(private userRepository: UserRepository) {}

  async execute(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
