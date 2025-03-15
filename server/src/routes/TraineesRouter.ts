import { Router } from 'express';
import RouterType from './Router';
import {
  TraineeControllerType,
  InteractionControllerType,
  TestControllerType,
  ProfilePictureControllerType,
  StrikeControllerType,
} from '../controllers';
import Middleware from '../middlewares/Middleware';
import { EmploymentHistoryControllerType } from '../controllers/Trainee/EmploymentHistoryController';

export class TraineesRouter implements RouterType {
  private readonly traineeController: TraineeControllerType;
  private readonly interactionController: InteractionControllerType;
  private readonly profilePictureController: ProfilePictureControllerType;
  private readonly testController: TestControllerType;
  private readonly employmentHistoryController: EmploymentHistoryControllerType;
  private readonly strikeController: StrikeControllerType;
  private readonly middlewares: Middleware[];

  constructor(
    traineesController: TraineeControllerType,
    interactionController: InteractionControllerType,
    testController: TestControllerType,
    profilePictureController: ProfilePictureControllerType,
    strikeController: StrikeControllerType,
    employmentHistoryController: EmploymentHistoryControllerType,
    middlewares: Middleware[] = []
  ) {
    this.traineeController = traineesController;
    this.interactionController = interactionController;
    this.testController = testController;
    this.profilePictureController = profilePictureController;
    this.strikeController = strikeController;
    this.employmentHistoryController = employmentHistoryController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.post('/', this.traineeController.createTrainee.bind(this.traineeController));
    router.get('/:id', this.traineeController.getTrainee.bind(this.traineeController));
    router.patch('/:id', this.traineeController.updateTrainee.bind(this.traineeController));
    router.delete('/:id', this.traineeController.deleteTrainee.bind(this.traineeController));

    router.put(
      '/:id/profile-picture',
      this.profilePictureController.setProfilePicture.bind(this.profilePictureController)
    );
    router.delete(
      '/:id/profile-picture',
      this.profilePictureController.deleteProfilePicture.bind(this.profilePictureController)
    );

    router.get('/:id/strikes', this.strikeController.getStrikes.bind(this.strikeController));
    router.post('/:id/strikes', this.strikeController.addStrike.bind(this.strikeController));
    router.put('/:id/strikes/:strikeId', this.strikeController.updateStrike.bind(this.strikeController));
    router.delete('/:id/strikes/:strikeId', this.strikeController.deleteStrike.bind(this.strikeController));

    router.get('/:id/interactions', this.interactionController.getInteractions.bind(this.interactionController));
    router.post('/:id/interactions', this.interactionController.addInteraction.bind(this.interactionController));
    router.put(
      '/:id/interactions/:interactionID',
      this.interactionController.updateInteraction.bind(this.interactionController)
    );
    router.delete(
      '/:id/interactions/:interactionID',
      this.interactionController.deleteInteraction.bind(this.interactionController)
    );

    router.get('/:id/tests', this.testController.getTests.bind(this.testController));
    router.post('/:id/tests', this.testController.addTest.bind(this.testController));
    router.put('/:id/tests/:testID', this.testController.updateTest.bind(this.testController));
    router.delete('/:id/tests/:testID', this.testController.deleteTest.bind(this.testController));

    router.get(
      '/:id/employment-history',
      this.employmentHistoryController.getEmploymentHistory.bind(this.employmentHistoryController)
    );
    router.post(
      '/:id/employment-history',
      this.employmentHistoryController.addEmploymentHistory.bind(this.employmentHistoryController)
    );
    router.put(
      '/:id/employment-history/:employmentHistoryID',
      this.employmentHistoryController.updateEmploymentHistory.bind(this.employmentHistoryController)
    );
    router.delete(
      '/:id/employment-history/:employmentHistoryID',
      this.employmentHistoryController.deleteEmploymentHistory.bind(this.employmentHistoryController)
    );
    return router;
  }
}
