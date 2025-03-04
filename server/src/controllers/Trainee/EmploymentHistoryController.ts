import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../../models';

export interface EmploymentHistoryControllerType {
  getEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  addEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class EmploymentHistoryController implements EmploymentHistoryControllerType {
  constructor() {}

  async getEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.send(new ResponseError('Not implemented'));
  }
  async addEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.send(new ResponseError('Not implemented'));
  }
  async updateEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.send(new ResponseError('Not implemented'));
  }
  async deleteEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.send(new ResponseError('Not implemented'));
  }
}
