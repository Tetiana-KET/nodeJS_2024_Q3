export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, errorName: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = errorName;
  }
}
