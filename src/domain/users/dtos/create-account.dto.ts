export class CreateAccountInput {
  public constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}
}
