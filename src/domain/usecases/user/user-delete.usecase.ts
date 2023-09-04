import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';

export class UserDeleteUseCase implements IUseCase {
  public constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
