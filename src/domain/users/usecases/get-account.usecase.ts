import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { UserRepository } from '../repositories/user.repository';
import { GetAccountOutput } from '../dtos/get-account.dto';

export class UserGetAccountUseCaseCase implements IUseCase {
  public constructor(private userRepository: UserRepository) {}

  async execute(id: number): Promise<GetAccountOutput> {
    const user = await this.userRepository.findById(id);

    return { name: user.name, email: user.email };
  }
}
