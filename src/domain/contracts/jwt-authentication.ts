export interface IJWTAuthentication {
  sign(data: Record<any, any>): Promise<string>;
  verify(token: string): Promise<Record<any, any>>;
}

export const IJWTAuthentication = Symbol('IJWTAuthentication');
