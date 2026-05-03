import { Request, Response, NextFunction } from 'express';
import { EmploymentHistoryControllerType } from '../controllers/Trainee/EmploymentHistoryController';
import { EmploymentHistory } from '../models';
import { sendError } from './Handler';

export interface EmploymentHistoryHandlerType {
  getEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  addEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class EmploymentHistoryHandler implements EmploymentHistoryHandlerType {
  constructor(private readonly controller: EmploymentHistoryControllerType) {}

  async getEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await this.controller.getEmploymentHistory(String(req.params.id));
      res.status(200).json(history);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async addEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    const history = req.body as EmploymentHistory;
    try {
      const created = await this.controller.addEmploymentHistory(String(req.params.id), history);
      res.status(201).json(created);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async updateEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    const history: EmploymentHistory = {
      id: String(req.params.employmentHistoryID),
      type: req.body?.type,
      companyName: req.body?.companyName,
      role: req.body?.role,
      startDate: req.body?.startDate ? new Date(req.body.startDate) : (undefined as unknown as Date),
      endDate: req.body?.endDate ? new Date(req.body.endDate) : undefined,
      feeCollected: req.body?.feeCollected,
      feeAmount: req.body?.feeAmount,
      comments: req.body?.comments,
    };

    try {
      const updated = await this.controller.updateEmploymentHistory(String(req.params.id), history);
      res.status(200).json(updated);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.controller.deleteEmploymentHistory(String(req.params.id), String(req.params.employmentHistoryID));
      res.status(204).send();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
