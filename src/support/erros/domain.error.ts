export class DomainError extends Error {
  public readonly context: string;

  constructor(context: string, message: string) {
    super(message);
    this.context = context;
  }
}
