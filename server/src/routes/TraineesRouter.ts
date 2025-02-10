import { Router } from 'express';
import RouterType from './Router';
import { TraineeControllerType, InteractionControllerType, TestControllerType } from '../controllers';
import Middleware from '../middlewares/Middleware';

export class TraineesRouter implements RouterType {
  private readonly traineeController: TraineeControllerType;
  private readonly interactionController: InteractionControllerType;
  private readonly testController: TestControllerType;
  private readonly middlewares: Middleware[];

  constructor(
    traineesController: TraineeControllerType,
    interactionController: InteractionControllerType,
    testController: TestControllerType,
    middlewares: Middleware[] = []
  ) {
    this.traineeController = traineesController;
    this.interactionController = interactionController;
    this.testController = testController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.post('/', this.traineeController.createTrainee.bind(this.traineeController));
    router.get('/:id', this.traineeController.getTrainee.bind(this.traineeController));
    router.patch('/:id', this.traineeController.updateTrainee.bind(this.traineeController));
    router.delete('/:id', this.traineeController.deleteTrainee.bind(this.traineeController));

    router.get('/:id/profile-picture', this.traineeController.getProfilePicture.bind(this.traineeController));
    router.put('/:id/profile-picture', this.traineeController.setProfilePicture.bind(this.traineeController));
    router.delete('/:id/profile-picture', this.traineeController.deleteProfilePicture.bind(this.traineeController));

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
    return router;
  }
}
