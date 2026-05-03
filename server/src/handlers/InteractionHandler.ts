import { Request, Response, NextFunction } from 'express';
import { InteractionControllerType } from '../controllers/Trainee/InteractionController';
import { AuthenticatedUser, InteractionWithReporterID } from '../models';
import { sendError } from './Handler';

export interface InteractionHandlerType {
  getInteractions(req: Request, res: Response, next: NextFunction): Promise<void>;
  addInteraction(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateInteraction(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteInteraction(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class InteractionHandler implements InteractionHandlerType {
  constructor(private readonly controller: InteractionControllerType) {}

  async getInteractions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const interactions = await this.controller.getInteractions(String(req.params.id));
      res.status(200).json(interactions);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async addInteraction(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = res.locals.user as AuthenticatedUser;
    const { date, type, title, details } = req.body ?? {};
    const interaction: InteractionWithReporterID = {
      date,
      type,
      title,
      details,
      reporterID: req.body?.reporterID || user.id,
    } as InteractionWithReporterID;

    try {
      const created = await this.controller.addInteraction(String(req.params.id), interaction);
      res.status(201).json(created);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async updateInteraction(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = res.locals.user as AuthenticatedUser;
    const interaction: InteractionWithReporterID = {
      id: String(req.params.interactionID),
      date: req.body?.date,
      type: req.body?.type,
      title: req.body?.title,
      details: req.body?.details,
      reporterID: req.body?.reporterID || user.id,
    };

    try {
      const updated = await this.controller.updateInteraction(String(req.params.id), interaction);
      res.status(200).json(updated);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteInteraction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.controller.deleteInteraction(String(req.params.id), String(req.params.interactionID));
      res.status(204).end();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
