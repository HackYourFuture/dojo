import { Request, Response, NextFunction } from 'express';
import { TraineesRepository } from '../../repositories';
import { AuthenticatedUser, ResponseError, StrikeWithReporterID } from '../../models';
import { NotificationService } from '../../services';
import { validateStrike } from '../../models/Strike';
import { UserRepository } from '../../repositories/UserRepository';

export interface StrikeControllerType {
  getStrikes(req: Request, res: Response, next: NextFunction): Promise<void>;
  addStrike(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateStrike(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteStrike(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class StrikeController implements StrikeControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService
  ) {}

  async getStrikes(req: Request, res: Response) {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const strikes = await this.traineesRepository.getStrikes(trainee.id);
    res.status(200).json(strikes);
  }

  async addStrike(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const { reason, date, comments } = req.body;
    const user = res.locals.user as AuthenticatedUser;
    const reporterID = req.body.reporterID || user.id;
    const newStrike = { reason, date, comments, reporterID } as StrikeWithReporterID;

    // Validate new strike model before creation
    try {
      validateStrike(newStrike);
      const reporter = await this.userRepository.findUserByID(reporterID);
      if (!reporter) {
        throw new Error(`Invalid reporter ID ${reporterID}. User not found.`);
      }
    } catch (error) {
      if (error instanceof Error) res.status(400).send(new ResponseError(error.message));
      return;
    }

    const strike = await this.traineesRepository.addStrike(req.params.id, newStrike);
    res.status(201).json(strike);
    await this.notificationService.strikeCreated(trainee, strike);
  }

  async updateStrike(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const strike = trainee.educationInfo.strikes.find((strike) => strike.id === req.params.strikeId);
    if (!strike) {
      res.status(404).send(new ResponseError('Strike not found'));
      return;
    }

    const user = res.locals.user as AuthenticatedUser;
    const strikeToUpdate: StrikeWithReporterID = {
      id: req.params.strikeId,
      reason: req.body.reason,
      date: req.body.date,
      comments: req.body.comments,
      reporterID: req.body.reporterID || user.id,
    };

    // Validate new strike model after applying the changes
    try {
      validateStrike(strikeToUpdate);
    } catch (error) {
      if (error instanceof Error) res.status(400).send(new ResponseError(error.message));
      return;
    }

    const updatedStrike = await this.traineesRepository.updateStrike(req.params.id, strikeToUpdate);
    res.status(200).json(updatedStrike);
  }

  async deleteStrike(req: Request, res: Response): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    await this.traineesRepository.deleteStrike(req.params.id, req.params.strikeId);
    res.status(204).end();
  }
}
