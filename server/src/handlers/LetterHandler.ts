import { Request, Response, NextFunction } from 'express';
import sentry from '@sentry/node';
import { LetterControllerType } from '../controllers/Trainee/LetterController';
import { LetterType } from '../services';
import { sendError } from './Handler';

export interface LetterHandlerType {
  generateLetter(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class LetterHandler implements LetterHandlerType {
  constructor(private readonly controller: LetterControllerType) {}

  async generateLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    const traineeId = String(req.params.id);
    const type = req.body?.type as LetterType;

    try {
      const { stream, fileName, contentType } = await this.controller.generateLetter({ traineeId, type });
      res.status(200).header({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      stream.pipe(res);
    } catch (error) {
      sentry.captureException(error);
      sendError(error, res, next);
    }
  }
}
