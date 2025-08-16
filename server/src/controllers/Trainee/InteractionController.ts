import { Request, Response, NextFunction } from 'express';
import { TraineesRepository, UserRepository } from '../../repositories';
import { AuthenticatedUser, InteractionWithReporterID, ResponseError } from '../../models';
import { NotificationService } from '../../services';
import { validateInteraction } from '../../models/Interaction';
export interface InteractionControllerType {
  getInteractions(req: Request, res: Response, next: NextFunction): Promise<void>;
  addInteraction(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateInteraction(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteInteraction(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class InteractionController implements InteractionControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly userRepository: UserRepository,
    private notificationService: NotificationService
  ) {}

  async getInteractions(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const interactions = await this.traineesRepository.getInteractions(trainee.id);
    res.status(200).json(interactions);
  }

  async addInteraction(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const { date, type, title, details } = req.body;
    const user = res.locals.user as AuthenticatedUser;
    const reporterID = req.body.reporterID || user.id;
    const newInteraction = { date, type, title, details, reporterID } as InteractionWithReporterID;

    // Validate new interaction model before creation
    try {
      validateInteraction(newInteraction);
      const reporter = await this.userRepository.findUserByID(reporterID);
      if (!reporter) {
        throw new Error(`Invalid reporter ID ${reporterID}. User not found.`);
      }
    } catch (error) {
      if (error instanceof Error) res.status(400).send(new ResponseError(error.message));
      return;
    }

    const interaction = await this.traineesRepository.addInteraction(req.params.id, newInteraction);
    res.status(201).json(interaction);
    await this.notificationService.interactionCreated(trainee, interaction);
  }

  async updateInteraction(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const interaction = trainee.interactions.find((interaction) => interaction.id === req.params.interactionID);
    if (!interaction) {
      res.status(404).send(new ResponseError('Interaction not found'));
      return;
    }

    const user = res.locals.user as AuthenticatedUser;
    const interactionToUpdate: InteractionWithReporterID = {
      id: req.params.interactionID,
      date: req.body.date,
      type: req.body.type,
      title: req.body.title,
      details: req.body.details,
      reporterID: req.body.reporterID || user.id,
    };

    // Validate new interaction model after applying the changes
    try {
      validateInteraction(interactionToUpdate);
    } catch (error) {
      if (error instanceof Error) res.status(400).send(new ResponseError(error.message));
      return;
    }

    const updatedInteraction = await this.traineesRepository.updateInteraction(req.params.id, interactionToUpdate);
    res.status(200).json(updatedInteraction);
  }

  async deleteInteraction(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    if (!trainee.interactions.find((interaction) => interaction.id === req.params.interactionID)) {
      res.status(404).send(new ResponseError('Interaction not found'));
      return;
    }

    await this.traineesRepository.deleteInteraction(req.params.id, req.params.interactionID);
    res.status(204).end();
  }
}
