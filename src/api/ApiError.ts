export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);

   
    Object.setPrototypeOf(this, ApiError.prototype);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
