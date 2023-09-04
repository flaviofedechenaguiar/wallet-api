import { IJWTAuthentication } from 'src/domain/contracts/jwt-authentication';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { IUserRepository } from 'src/domain/repositories/user/user.repository';

export class UserVerifyAuthenticationUseCase implements IUseCase {
  public constructor(
    private userRepository: IUserRepository,
    private authentication: IJWTAuthentication,
  ) {}

  async execute(token: string): Promise<number> {
    try {
      const claims = await this.authentication.verify(token);
      await this.userRepository.findById(claims.id as number);

      return claims.id as number;
    } catch (err) {
      throw new Error('Access not allowed.');
    }
  }
}
