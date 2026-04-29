import { Request, Response, NextFunction } from 'express';
import { TraineeControllerType } from '../controllers/Trainee/TraineeController';
import { AuthenticatedUser } from '../models';
import { sendError } from './Handler';

export interface TraineeHandlerType {
  getTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
  createTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class TraineeHandler implements TraineeHandlerType {
  constructor(private readonly controller: TraineeControllerType) {}

  async getTrainee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainee = await this.controller.getTrainee(String(req.params.id));
      res.status(200).json(trainee);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async createTrainee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainee = await this.controller.createTrainee(req.body);
      res.status(201).json(trainee);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async updateTrainee(req: Request, res: Response, next: NextFunction): Promise<void> {
    const actor = res.locals.user as AuthenticatedUser;
    try {
      const trainee = await this.controller.updateTrainee(String(req.params.id), req.body, actor);
      res.status(200).json(trainee);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteTrainee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.controller.deleteTrainee(String(req.params.id));
      res.status(204).end();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
