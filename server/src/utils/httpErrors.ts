import z, { ZodError } from 'zod';

export abstract class HttpError extends Error {
  abstract readonly statusCode: number;
}

export class UnauthorizedError extends HttpError {
  readonly statusCode = 401;

  constructor(message = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends HttpError {
  readonly statusCode = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class NotFoundError extends HttpError {
  readonly statusCode = 404;

  constructor(message = 'Not Found') {
    super(message);
  }
}

export class ConflictError extends HttpError {
  readonly statusCode = 409;

  constructor(message = 'Conflict') {
    super(message);
  }
}

export class InternalServerError extends HttpError {
  readonly statusCode = 500;

  constructor(message = 'Internal Server Error') {
    super(message);
  }
}

export type ZodFlattenedError = ReturnType<typeof z.flattenError>;

export class BadRequestError extends HttpError {
  readonly statusCode = 400;
  zodError?: ZodFlattenedError;

  /**
   * This class constructor is overloaded to handle two cases:
   * @param message - You can provide a string message or leave it empty to use the default message.
   * @param error - If you provide a ZodError and you want to use it as string, set stringify to 'stringify'.
   */
  constructor(message?: string);
  constructor(error: ZodError, stringify: 'stringify' | false);

  constructor(reason?: string | ZodError, stringify: 'stringify' | false = false) {
    let message: string;

    // assign message based on the type of reason
    // reason is ZodError
    if (reason instanceof ZodError) {
      message = z.prettifyError(reason);
    }
    // reason is string
    else if (typeof reason === 'string') {
      message = reason;
    }
    // reason is not provided
    else {
      message = 'Bad Request. Make sure your request data is correct.';
    }
    super(message);

    // assign zodError if stringify is false
    if (!stringify && reason instanceof ZodError) {
      this.zodError = z.flattenError(reason);
    }
  }
}
