export class ResponseError {
  readonly error: string;
  constructor(error: string) {
    this.error = error;
  }
}