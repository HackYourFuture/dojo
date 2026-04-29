import { TraineesRepository } from '../../repositories';
import { StrikeWithReporter, StrikeWithReporterID } from '../../models';
import { NotificationService } from '../../services';
import { validateStrike } from '../../models/Strike';
import { UserRepository } from '../../repositories/UserRepository';
import { BadRequestError, NotFoundError } from '../../errors';

export interface StrikeControllerType {
  getStrikes(traineeId: string): Promise<StrikeWithReporter[]>;
  addStrike(traineeId: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  updateStrike(traineeId: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  deleteStrike(traineeId: string, strikeId: string): Promise<void>;
}

export class StrikeController implements StrikeControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService
  ) {}

  async getStrikes(traineeId: string): Promise<StrikeWithReporter[]> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }
    return this.traineesRepository.getStrikes(trainee.id);
  }

  async addStrike(traineeId: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    try {
      validateStrike(strike);
      const reporter = await this.userRepository.findUserByID(strike.reporterID);
      if (!reporter) {
        throw new Error(`Invalid reporter ID ${strike.reporterID}. User not found.`);
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    const created = await this.traineesRepository.addStrike(traineeId, strike);
    this.notificationService.strikeCreated(trainee, created);
    return created;
  }

  async updateStrike(traineeId: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    const existing = trainee.educationInfo.strikes.find((s) => s.id === strike.id);
    if (!existing) {
      throw new NotFoundError('Strike not found');
    }

    try {
      validateStrike(strike);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    return this.traineesRepository.updateStrike(traineeId, strike);
  }

  async deleteStrike(traineeId: string, strikeId: string): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }
    await this.traineesRepository.deleteStrike(traineeId, strikeId);
  }
}
