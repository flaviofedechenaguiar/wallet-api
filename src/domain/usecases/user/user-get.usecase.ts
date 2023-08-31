import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user.repository';

type Output = {
  name: string;
  email: string;
};

export class UserGetUseCase implements IUseCase {
  public constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<Output> {
    const user = await this.userRepository.findById(id);

    return { name: user.name, email: user.email };
  }
}
