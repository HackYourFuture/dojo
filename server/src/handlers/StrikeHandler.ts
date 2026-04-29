import { Request, Response, NextFunction } from 'express';
import { StrikeControllerType } from '../controllers/Trainee/StrikeController';
import { AuthenticatedUser, StrikeWithReporterID } from '../models';
import { sendError } from './Handler';

export interface StrikeHandlerType {
  getStrikes(req: Request, res: Response, next: NextFunction): Promise<void>;
  addStrike(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateStrike(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteStrike(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class StrikeHandler implements StrikeHandlerType {
  constructor(private readonly controller: StrikeControllerType) {}

  async getStrikes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const strikes = await this.controller.getStrikes(String(req.params.id));
      res.status(200).json(strikes);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async addStrike(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = res.locals.user as AuthenticatedUser;
    const { reason, date, comments } = req.body ?? {};
    const strike: StrikeWithReporterID = {
      reason,
      date,
      comments,
      reporterID: req.body?.reporterID || user.id,
    } as StrikeWithReporterID;

    try {
      const created = await this.controller.addStrike(String(req.params.id), strike);
      res.status(201).json(created);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async updateStrike(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = res.locals.user as AuthenticatedUser;
    const strike: StrikeWithReporterID = {
      id: String(req.params.strikeId),
      reason: req.body?.reason,
      date: req.body?.date,
      comments: req.body?.comments,
      reporterID: req.body?.reporterID || user.id,
    };

    try {
      const updated = await this.controller.updateStrike(String(req.params.id), strike);
      res.status(200).json(updated);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteStrike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.controller.deleteStrike(String(req.params.id), String(req.params.strikeId));
      res.status(204).end();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
