import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJWTAuthentication } from 'src/domain/contracts/jwt-authentication';

@Injectable()
export class JWTAuthentication implements IJWTAuthentication {
  public constructor(private jwtService: JwtService) {}

  async sign(data: Record<any, any>): Promise<string> {
    return await this.jwtService.signAsync(data);
  }

  async verify(token: string): Promise<Record<any, any>> {
    return await this.jwtService.verifyAsync<Record<any, any>>(token);
  }
}
