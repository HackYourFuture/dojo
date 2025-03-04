import { Router } from 'express';
import RouterType from './Router';
import {
  TraineeControllerType,
  InteractionControllerType,
  TestControllerType,
  ProfilePictureControllerType,
} from '../controllers';
import Middleware from '../middlewares/Middleware';
import { EmploymentHistoryControllerType } from '../controllers/Trainee/EmploymentHistoryController';

export class TraineesRouter implements RouterType {
  private readonly traineeController: TraineeControllerType;
  private readonly interactionController: InteractionControllerType;
  private readonly profilePictureController: ProfilePictureControllerType;
  private readonly testController: TestControllerType;
  private readonly employmentHistoryController: EmploymentHistoryControllerType;

  private readonly middlewares: Middleware[];

  constructor(
    traineesController: TraineeControllerType,
    interactionController: InteractionControllerType,
    testController: TestControllerType,
    profilePictureController: ProfilePictureControllerType,
    employmentHistoryController: EmploymentHistoryControllerType,
    middlewares: Middleware[] = []
  ) {
    this.traineeController = traineesController;
    this.interactionController = interactionController;
    this.testController = testController;
    this.profilePictureController = profilePictureController;
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

    router.get('/:id/strikes', this.traineeController.getStrikes.bind(this.traineeController));
    router.post('/:id/strikes', this.traineeController.addStrike.bind(this.traineeController));
    router.put('/:id/strikes/:strikeId', this.traineeController.updateStrike.bind(this.traineeController));
    router.delete('/:id/strikes/:strikeId', this.traineeController.deleteStrike.bind(this.traineeController));

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
