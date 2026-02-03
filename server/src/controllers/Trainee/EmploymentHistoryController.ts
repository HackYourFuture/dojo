import { Request, Response, RequestHandler } from 'express';
import { EmploymentHistorySchema, Trainee, EmploymentHistory } from '../../models';
import { TraineesRepository } from '../../repositories';
import { BadRequestError, NotFoundError } from '../../utils/httpErrors';
import { TraineeHelper } from './TraineeHelper';

export interface EmploymentHistoryControllerType {
  getEmploymentHistory: RequestHandler;
  addEmploymentHistory: RequestHandler;
  updateEmploymentHistory: RequestHandler;
  deleteEmploymentHistory: RequestHandler;
}

export class EmploymentHistoryController implements EmploymentHistoryControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly traineeHelper: TraineeHelper
  ) {}

  async getEmploymentHistory(req: Request, res: Response): Promise<void> {
    // input
    const traineeID = req.params.id;

    // check if trainee exists
    await this.traineeHelper.getTraineeOrThrow(traineeID);

    // get
    const employmentHistory = await this.traineesRepository.getEmploymentHistory(traineeID);
    res.json(employmentHistory);
  }

  async addEmploymentHistory(req: Request, res: Response): Promise<void> {
    // input
    const traineeID = req.params.id;

    // validate
    const parsed = EmploymentHistorySchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error, 'stringify');
    const historyToAdd = parsed.data;

    // check if trainee exists
    await this.traineeHelper.getTraineeOrThrow(traineeID);

    // add
    const addedEmploymentHistory = await this.traineesRepository.addEmploymentHistory(traineeID, historyToAdd);
    res.status(201).json(addedEmploymentHistory);
  }

  async updateEmploymentHistory(req: Request, res: Response): Promise<void> {
    // input
    const traineeID = req.params.id;
    const employmentHistoryID = req.params.employmentHistoryID;

    // validate
    const parsed = EmploymentHistorySchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error, 'stringify');
    const historyToUpdate = parsed.data;

    // check if trainee and employment history exists
    const trainee = await this.traineeHelper.getTraineeOrThrow(traineeID);
    this.getEmploymentHistoryOrThrow(trainee, employmentHistoryID);

    // update
    const updatedEmploymentHistory = await this.traineesRepository.updateEmploymentHistory(traineeID, historyToUpdate);
    res.json(updatedEmploymentHistory);
  }

  async deleteEmploymentHistory(req: Request, res: Response): Promise<void> {
    // input
    const traineeID = req.params.id;
    const employmentHistoryID = req.params.employmentHistoryID;

    // check if trainee and employment history exists
    const trainee = await this.traineeHelper.getTraineeOrThrow(traineeID);
    this.getEmploymentHistoryOrThrow(trainee, employmentHistoryID);

    // delete
    await this.traineesRepository.deleteEmploymentHistory(traineeID, employmentHistoryID);
    res.status(204).send();
  }

  /**
   * Helper method to get employment history or throw NotFoundError
   */
  private getEmploymentHistoryOrThrow(trainee: Trainee, employmentHistoryID: string): EmploymentHistory {
    const employmentHistory = trainee.employmentInfo.employmentHistory.find(
      (history) => history.id === employmentHistoryID
    );

    if (!employmentHistory) throw new NotFoundError('Employment history not found');
    return employmentHistory;
  }
}
