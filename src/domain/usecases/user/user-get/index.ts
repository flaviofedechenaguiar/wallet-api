import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';
import { UserGetOutput } from './user-get-output';

export class UserGetUseCase implements IUseCase {
  public constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserGetOutput> {
    const user = await this.userRepository.findById(id);

    return { name: user.name, email: user.email };
  }
}
