import { Test, validateTest } from '../../models';
import { TraineesRepository } from '../../repositories';
import { NotificationService } from '../../services';
import { BadRequestError, NotFoundError } from '../../errors';

export interface TestControllerType {
  getTests(traineeId: string): Promise<Test[]>;
  addTest(traineeId: string, test: Test): Promise<Test>;
  updateTest(traineeId: string, test: Test): Promise<Test>;
  deleteTest(traineeId: string, testId: string): Promise<void>;
}

export class TestController implements TestControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly notificationService: NotificationService
  ) {}

  async getTests(traineeId: string): Promise<Test[]> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }
    return this.traineesRepository.getTests(trainee.id);
  }

  async addTest(traineeId: string, test: Test): Promise<Test> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    try {
      validateTest(test);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    const created = await this.traineesRepository.addTest(trainee.id, test);
    this.notificationService.testCreated(trainee, created);
    return created;
  }

  async updateTest(traineeId: string, test: Test): Promise<Test> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    const existing = trainee.educationInfo.tests.find((t) => t.id === test.id);
    if (!existing) {
      throw new NotFoundError('Test not found');
    }

    try {
      validateTest(test);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    return this.traineesRepository.updateTest(trainee.id, test);
  }

  async deleteTest(traineeId: string, testId: string): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    if (!trainee.educationInfo.tests.find((t) => t.id === testId)) {
      throw new NotFoundError('Test not found');
    }

    await this.traineesRepository.deleteTest(traineeId, testId);
  }
}
