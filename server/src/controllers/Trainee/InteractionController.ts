import { TraineesRepository, UserRepository } from '../../repositories';
import { Interaction, InteractionWithReporterID } from '../../models';
import { NotificationService } from '../../services';
import { validateInteraction } from '../../models/Interaction';
import { BadRequestError, NotFoundError } from '../../errors';

export interface InteractionControllerType {
  getInteractions(traineeId: string): Promise<Interaction[]>;
  addInteraction(traineeId: string, interaction: InteractionWithReporterID): Promise<Interaction>;
  updateInteraction(traineeId: string, interaction: InteractionWithReporterID): Promise<Interaction>;
  deleteInteraction(traineeId: string, interactionId: string): Promise<void>;
}

export class InteractionController implements InteractionControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService
  ) {}

  async getInteractions(traineeId: string): Promise<Interaction[]> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }
    return this.traineesRepository.getInteractions(trainee.id);
  }

  async addInteraction(traineeId: string, interaction: InteractionWithReporterID): Promise<Interaction> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    try {
      validateInteraction(interaction);
      const reporter = await this.userRepository.findUserByID(interaction.reporterID);
      if (!reporter) {
        throw new Error(`Invalid reporter ID ${interaction.reporterID}. User not found.`);
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    const created = await this.traineesRepository.addInteraction(traineeId, interaction);
    this.notificationService.interactionCreated(trainee, created);
    return created;
  }

  async updateInteraction(traineeId: string, interaction: InteractionWithReporterID): Promise<Interaction> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    const existing = trainee.interactions.find((i) => i.id === interaction.id);
    if (!existing) {
      throw new NotFoundError('Interaction not found');
    }

    try {
      validateInteraction(interaction);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    return this.traineesRepository.updateInteraction(traineeId, interaction);
  }

  async deleteInteraction(traineeId: string, interactionId: string): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    if (!trainee.interactions.find((i) => i.id === interactionId)) {
      throw new NotFoundError('Interaction not found');
    }

    await this.traineesRepository.deleteInteraction(traineeId, interactionId);
  }
}
