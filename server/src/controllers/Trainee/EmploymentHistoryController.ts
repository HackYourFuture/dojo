import { EmploymentHistory, validateEmploymentHistory } from '../../models';
import { TraineesRepository } from '../../repositories';
import { BadRequestError, NotFoundError } from '../../errors';

export interface EmploymentHistoryControllerType {
  getEmploymentHistory(traineeId: string): Promise<EmploymentHistory[]>;
  addEmploymentHistory(traineeId: string, history: EmploymentHistory): Promise<EmploymentHistory>;
  updateEmploymentHistory(traineeId: string, history: EmploymentHistory): Promise<EmploymentHistory>;
  deleteEmploymentHistory(traineeId: string, historyId: string): Promise<void>;
}

export class EmploymentHistoryController implements EmploymentHistoryControllerType {
  constructor(private readonly traineesRepository: TraineesRepository) {}

  async getEmploymentHistory(traineeId: string): Promise<EmploymentHistory[]> {
    return this.traineesRepository.getEmploymentHistory(traineeId);
  }

  async addEmploymentHistory(traineeId: string, history: EmploymentHistory): Promise<EmploymentHistory> {
    try {
      validateEmploymentHistory(history);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
    return this.traineesRepository.addEmploymentHistory(traineeId, history);
  }

  async updateEmploymentHistory(traineeId: string, history: EmploymentHistory): Promise<EmploymentHistory> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    const existing = trainee.employmentInfo.employmentHistory.find((h) => h.id === history.id);
    if (!existing) {
      throw new NotFoundError('Employment history was not found');
    }

    try {
      validateEmploymentHistory(history);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    return this.traineesRepository.updateEmploymentHistory(trainee.id, history);
  }

  async deleteEmploymentHistory(traineeId: string, historyId: string): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    if (!trainee.employmentInfo.employmentHistory.find((h) => h.id === historyId)) {
      throw new NotFoundError('Employment history not found');
    }

    await this.traineesRepository.deleteEmploymentHistory(trainee.id, historyId);
  }
}
