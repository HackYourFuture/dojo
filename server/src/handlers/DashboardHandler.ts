import { Request, Response, NextFunction } from 'express';
import { DashboardControllerType } from '../controllers/DashboardController';
import { sendError } from './Handler';

export interface DashboardHandlerType {
  getDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class DashboardHandler implements DashboardHandlerType {
  private readonly controller: DashboardControllerType;

  constructor(controller: DashboardControllerType) {
    this.controller = controller;
  }

  async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.controller.getDashboard();
      res.status(200).json(data);
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
