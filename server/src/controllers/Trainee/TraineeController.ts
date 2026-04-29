import { TraineesRepository } from '../../repositories';
import { AuthenticatedUser, Trainee } from '../../models';
import { NotificationService, UpdateChange } from '../../services';
import { validateTrainee } from '../../models/Trainee';
import { BadRequestError, NotFoundError } from '../../errors';

export interface TraineeControllerType {
  getTrainee(traineeId: string): Promise<Trainee>;
  createTrainee(input: any): Promise<Trainee>;
  updateTrainee(traineeId: string, input: any, actor: AuthenticatedUser): Promise<Trainee>;
  deleteTrainee(traineeId: string): Promise<void>;
}

export class TraineeController implements TraineeControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly notificationService: NotificationService
  ) {}

  async getTrainee(traineeId: string): Promise<Trainee> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee was not found');
    }
    return trainee;
  }

  async createTrainee(input: any): Promise<Trainee> {
    const body = input ?? {};
    body.educationInfo = body.educationInfo ?? {};
    body.employmentInfo = body.employmentInfo ?? {};

    try {
      validateTrainee(body);
    } catch (error: any) {
      throw new BadRequestError(`Invalid trainee information. ${error.message}`);
    }

    const email = body.contactInfo.email;
    const emailExists = await this.traineesRepository.isEmailExists(email);
    if (emailExists) {
      throw new BadRequestError(`There is already another trainee in the system with the email ${email}`);
    }

    return this.traineesRepository.createTrainee(body);
  }

  async updateTrainee(traineeId: string, input: any, actor: AuthenticatedUser): Promise<Trainee> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    const changes = this.applyObjectUpdate(input, trainee);

    try {
      validateTrainee(trainee);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    await this.traineesRepository.updateTrainee(trainee);
    this.notificationService.traineeUpdated(trainee, changes, actor);
    return trainee;
  }

  async deleteTrainee(_traineeId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  // This function updates the destination object with the source object.
  // It is similar to Object.assign but works for nested objects and skips arrays.
  private applyObjectUpdate(
    source: any,
    destination: any,
    nestLevel: number = 0,
    changes: UpdateChange[] = []
  ): UpdateChange[] {
    if (nestLevel > 5) {
      return changes;
    }

    for (const key of Object.keys(source)) {
      if (Array.isArray(source[key]) || !(key in destination)) {
        continue;
      }
      if (typeof source[key] === 'object' && source[key] !== null) {
        this.applyObjectUpdate(source[key], destination[key], nestLevel + 1, changes);
        continue;
      }
      if (destination[key] === source[key]) {
        continue;
      }

      if (destination[key] !== source[key]) {
        changes.push({
          fieldName: key,
          previousValue: destination[key],
          newValue: source[key],
        });
      }
      destination[key] = source[key];
    }

    return changes;
  }
}
