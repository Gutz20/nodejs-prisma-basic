export class MySMTPError extends Error {
  code = 400;
  details?: any;

  constructor(message: string, code?: number, details?: any) {
    super(message);
    if (code) {
      this.code = code;
      this.details = details;
    }
  }
}
