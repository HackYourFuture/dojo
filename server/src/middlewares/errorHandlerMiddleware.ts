import { Request, Response, ErrorRequestHandler } from 'express';
import { BadRequestError, HttpError, ZodFlattenedError } from '../utils/httpErrors';
import sentry from '@sentry/node';

// ? this is done in a functional style for the following reasons:
// * - no external dependencies are needed and has only one dependent: the express app
// * - to satisfy the linter in a class format, unnecessary code/ignore-comments would be needed

export const errorHandlerMiddleware: ErrorRequestHandler = (error: Error, req: Request, res: Response) => {
  let statusCode: number;
  let response: ZodFlattenedError | string | Error;

  // decide status code and response based on the error type
  // - ZodError that will be provided as an object
  if (error instanceof BadRequestError && error.zodError) {
    statusCode = error.statusCode;
    response = error.zodError;
  }
  // - HttpError, including stringified ZodError
  else if (error instanceof HttpError) {
    statusCode = error.statusCode;
    response = error.message;
  }
  // - Error
  else {
    const isProduction = process.env.NODE_ENV === 'production';

    statusCode = 500;
    response = isProduction ? 'Something broke!' : error;

    // extra measures for unexpected/unhandled errors
    if (isProduction) sentry.captureException(error);
    else console.error(error);
  }

  // send the response
  res.status(statusCode).json({ error: response });
};
