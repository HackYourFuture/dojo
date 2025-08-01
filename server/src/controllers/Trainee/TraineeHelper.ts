import { Trainee } from '../../models';
import { TraineesRepository } from '../../repositories';
import { NotFoundError } from '../../utils/httpErrors';

export interface TraineeHelper {
  getTraineeOrThrow(traineeID: string): Promise<Trainee>;
}

/**
 * This class provides helper for methods that are used repeatedly in the trainee controllers.
 */
export class DefaultTraineeHelper implements TraineeHelper {
  constructor(private readonly traineesRepository: TraineesRepository) {
    this.getTraineeOrThrow = this.getTraineeOrThrow.bind(this);
  }

  async getTraineeOrThrow(traineeID: string): Promise<Trainee> {
    const trainee = await this.traineesRepository.getTrainee(traineeID);
    if (!trainee) throw new NotFoundError('Trainee not found');
    return trainee;
  }
}
