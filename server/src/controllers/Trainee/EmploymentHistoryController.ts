import { Request, Response, NextFunction } from 'express';
import { ResponseError, EmploymentHistory, validateEmploymentHistory } from '../../models';
import { TraineesRepository } from '../../repositories';

export interface EmploymentHistoryControllerType {
  getEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  addEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class EmploymentHistoryController implements EmploymentHistoryControllerType {
  constructor(private readonly traineesRepository: TraineesRepository) {}

  async getEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const traineeID = req.params.id;
      const employmentHistory = await this.traineesRepository.getEmploymentHistory(traineeID);
      res.json(employmentHistory);
    } catch (error: any) {
      next(error);
    }
  }

  async addEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    const traineeID = req.params.id;
    const employmentHistoryData: EmploymentHistory = req.body;
    try {
      validateEmploymentHistory(employmentHistoryData);
    } catch (error: any) {
      res.status(400).send(new ResponseError(error.message));
      return;
    }

    try {
      const newEmploymentHistory = await this.traineesRepository.addEmploymentHistory(traineeID, employmentHistoryData);
      res.status(201).json(newEmploymentHistory);
    } catch (error: any) {
      next(error);
    }
  }

  async updateEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const employmentHistoryData = trainee.employmentInfo.employmentHistory.find(
      (history) => history.id === req.params.employmentHistoryID
    );
    if (!employmentHistoryData) {
      res.status(404).send(new ResponseError('Employment history was not found'));
      return;
    }

    const historyToUpdate: EmploymentHistory = {
      id: employmentHistoryData.id,
      type: req.body.type,
      companyName: req.body.companyName,
      role: req.body.role,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      feeCollected: req.body.feeCollected,
      feeAmount: req.body.feeAmount,
      comments: req.body.comments,
    };

    try {
      validateEmploymentHistory(historyToUpdate);
    } catch (error: any) {
      res.status(400).send(new ResponseError(error.message));
      return;
    }

    try {
      const updatedEmploymentHistory = await this.traineesRepository.updateEmploymentHistory(
        trainee.id,
        historyToUpdate
      );

      res.json(updatedEmploymentHistory);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteEmploymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainee = await this.traineesRepository.getTrainee(req.params.id);
      if (!trainee) {
        res.status(404).send(new ResponseError('Trainee not found'));
        return;
      }

      const employmentHistoryID = req.params.employmentHistoryID;
      if (!trainee.employmentInfo.employmentHistory.find((history) => history.id === employmentHistoryID)) {
        res.status(404).send(new ResponseError('Employment history not found'));
        return;
      }

      await this.traineesRepository.deleteEmploymentHistory(trainee.id, employmentHistoryID);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
}
