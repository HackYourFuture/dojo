import { Request, Response, RequestHandler } from 'express';
import { Trainee, InteractionInputSchema, InteractionWithReporter } from '../../models';
import { TraineesRepository, UserRepository } from '../../repositories';
import { NotificationService } from '../../services';
import { TraineeHelper } from './TraineeHelper';
import { BadRequestError, NotFoundError } from '../../utils/httpErrors';
export interface InteractionControllerType {
  getInteractions: RequestHandler;
  addInteraction: RequestHandler;
  updateInteraction: RequestHandler;
  deleteInteraction: RequestHandler;
}

export class InteractionController implements InteractionControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly userRepository: UserRepository,
    private notificationService: NotificationService,
    private readonly traineeHelper: TraineeHelper
  ) {}

  async getInteractions(req: Request, res: Response): Promise<void> {
    // input
    const traineeID = req.params.id;

    // check if trainee exists
    await this.traineeHelper.getTraineeOrThrow(traineeID);

    // get
    const interactions = await this.traineesRepository.getInteractions(traineeID);
    res.status(200).json(interactions);
  }

  async addInteraction(req: Request, res: Response): Promise<void> {
    // input
    const reporterID = res.locals.user.id;
    const traineeID = req.params.id;

    // validate
    const parsed = InteractionInputSchema.safeParse({ reporterID, ...req.body });
    if (!parsed.success) throw new BadRequestError(parsed.error, 'stringify');
    const interactionToAdd = parsed.data;

    // get trainee
    const trainee = await this.traineeHelper.getTraineeOrThrow(traineeID);

    // check if reporter exists
    const reporter = await this.userRepository.findUserByID(reporterID);
    if (!reporter) throw new NotFoundError(`Invalid reporter ID ${reporterID}. User not found.`);

    // add and notify
    const addedInteraction = await this.traineesRepository.addInteraction(traineeID, interactionToAdd);
    res.status(201).json(addedInteraction);
    await this.notificationService.interactionCreated(trainee, addedInteraction);
  }

  async updateInteraction(req: Request, res: Response): Promise<void> {
    // input
    const reporterID = res.locals.user.id;
    const traineeID = req.params.id;
    const interactionID = req.params.interactionID;

    // validate
    const parsed = InteractionInputSchema.safeParse({ reporterID, ...req.body, id: interactionID });
    if (!parsed.success) throw new BadRequestError(parsed.error, 'stringify');
    const interactionToUpdate = parsed.data;

    // check if trainee and interaction exist
    const trainee = await this.traineeHelper.getTraineeOrThrow(traineeID);
    this.getInteractionOrThrow(trainee, interactionID);

    // update
    const updatedInteraction = await this.traineesRepository.updateInteraction(traineeID, interactionToUpdate);
    res.status(200).json(updatedInteraction);
  }

  async deleteInteraction(req: Request, res: Response): Promise<void> {
    // input
    const traineeID = req.params.id;
    const interactionID = req.params.interactionID;

    // check if trainee and interaction exist
    const trainee = await this.traineeHelper.getTraineeOrThrow(traineeID);
    this.getInteractionOrThrow(trainee, interactionID);

    // delete
    await this.traineesRepository.deleteInteraction(traineeID, interactionID);
    res.status(204).end();
  }

  /**
   * Helper method to get interaction or throw NotFoundError
   */
  private getInteractionOrThrow(trainee: Trainee, interactionID: string): InteractionWithReporter {
    const interaction = trainee.interactions.find((interaction) => interaction.id === interactionID);
    if (!interaction) throw new NotFoundError('Interaction not found');
    return interaction;
  }
}
