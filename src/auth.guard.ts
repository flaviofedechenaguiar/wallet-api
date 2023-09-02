import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserVerifyAuthenticationUseCase } from './domain/usecases/user';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly userVerifyAuthentication: UserVerifyAuthenticationUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const authorization = request.headers?.authorization;
      if (!authorization) return false;

      const token = authorization.split(' ')[1];
      const userId = await this.userVerifyAuthentication.execute(token);
      Object.assign(request, { userId });

      return true;
    } catch (err) {
      return false;
    }
  }
}
