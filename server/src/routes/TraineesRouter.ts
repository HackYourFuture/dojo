import { Router } from 'express';
import RouterType from './Router';
import {
  TraineeHandlerType,
  InteractionHandlerType,
  TestHandlerType,
  ProfilePictureHandlerType,
  StrikeHandlerType,
  EmploymentHistoryHandlerType,
  LetterHandlerType,
} from '../handlers';
import Middleware from '../middlewares/Middleware';

export class TraineesRouter implements RouterType {
  constructor(
    private readonly traineeHandler: TraineeHandlerType,
    private readonly interactionHandler: InteractionHandlerType,
    private readonly testHandler: TestHandlerType,
    private readonly profilePictureHandler: ProfilePictureHandlerType,
    private readonly strikeHandler: StrikeHandlerType,
    private readonly employmentHistoryHandler: EmploymentHistoryHandlerType,
    private readonly letterHandler: LetterHandlerType,
    private readonly middlewares: Middleware[] = []
  ) {}

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));

    router.post('/', this.traineeHandler.createTrainee.bind(this.traineeHandler));
    router.get('/:id', this.traineeHandler.getTrainee.bind(this.traineeHandler));
    router.patch('/:id', this.traineeHandler.updateTrainee.bind(this.traineeHandler));
    router.delete('/:id', this.traineeHandler.deleteTrainee.bind(this.traineeHandler));

    router.put(
      '/:id/profile-picture',
      this.profilePictureHandler.setProfilePicture.bind(this.profilePictureHandler)
    );
    router.delete(
      '/:id/profile-picture',
      this.profilePictureHandler.deleteProfilePicture.bind(this.profilePictureHandler)
    );

    router.get('/:id/strikes', this.strikeHandler.getStrikes.bind(this.strikeHandler));
    router.post('/:id/strikes', this.strikeHandler.addStrike.bind(this.strikeHandler));
    router.put('/:id/strikes/:strikeId', this.strikeHandler.updateStrike.bind(this.strikeHandler));
    router.delete('/:id/strikes/:strikeId', this.strikeHandler.deleteStrike.bind(this.strikeHandler));

    router.get('/:id/interactions', this.interactionHandler.getInteractions.bind(this.interactionHandler));
    router.post('/:id/interactions', this.interactionHandler.addInteraction.bind(this.interactionHandler));
    router.put(
      '/:id/interactions/:interactionID',
      this.interactionHandler.updateInteraction.bind(this.interactionHandler)
    );
    router.delete(
      '/:id/interactions/:interactionID',
      this.interactionHandler.deleteInteraction.bind(this.interactionHandler)
    );

    router.get('/:id/tests', this.testHandler.getTests.bind(this.testHandler));
    router.post('/:id/tests', this.testHandler.addTest.bind(this.testHandler));
    router.put('/:id/tests/:testID', this.testHandler.updateTest.bind(this.testHandler));
    router.delete('/:id/tests/:testID', this.testHandler.deleteTest.bind(this.testHandler));

    router.get(
      '/:id/employment-history',
      this.employmentHistoryHandler.getEmploymentHistory.bind(this.employmentHistoryHandler)
    );
    router.post(
      '/:id/employment-history',
      this.employmentHistoryHandler.addEmploymentHistory.bind(this.employmentHistoryHandler)
    );
    router.put(
      '/:id/employment-history/:employmentHistoryID',
      this.employmentHistoryHandler.updateEmploymentHistory.bind(this.employmentHistoryHandler)
    );
    router.delete(
      '/:id/employment-history/:employmentHistoryID',
      this.employmentHistoryHandler.deleteEmploymentHistory.bind(this.employmentHistoryHandler)
    );

    router.post('/:id/letters', this.letterHandler.generateLetter.bind(this.letterHandler));
    return router;
  }
}
