import { Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { ResponseError } from '../models';

/**
 * Translates a controller error to an HTTP response.
 *
 * Domain errors (HttpError subclasses) become structured responses with the
 * appropriate status code. Anything else is forwarded to express's global
 * error handler via `next`.
 */
export function sendError(error: unknown, res: Response, next: NextFunction): void {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json(new ResponseError(error.message));
    return;
  }
  next(error);
}
