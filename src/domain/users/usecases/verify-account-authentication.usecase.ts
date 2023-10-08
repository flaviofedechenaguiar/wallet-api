import { IJWTAuthentication } from 'src/domain/contracts/jwt-authentication';
import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { DomainError } from 'src/support/erros/domain.error';
import { UserRepository } from '../repositories/user.repository';
import { Inject } from '@nestjs/common';

export class UserVerifyAuthenticationUseCase implements IUseCase {
  public constructor(
    private userRepository: UserRepository,
    @Inject(IJWTAuthentication) private authentication: IJWTAuthentication,
  ) {}

  async execute(token: string): Promise<number> {
    try {
      const claims = await this.authentication.verify(token);
      await this.userRepository.findById(claims.id as number);

      return claims.id as number;
    } catch (err) {
      throw new DomainError('Access not allowed.');
    }
  }
}
