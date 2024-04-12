import { Router, RequestHandler } from "express";
import RouterType from "./Router";
import { TraineesControllerType } from "../controllers/TraineesController";
import Middleware from "../middlewares/Middleware";

export default class TraineesRouter implements RouterType {
  private readonly traineesController: TraineesControllerType;
  private readonly middlewares: Middleware[];

  constructor(traineesController: TraineesControllerType, middlewares: Middleware[] = []) {
    this.traineesController = traineesController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach(middleware => router.use(middleware.handle.bind(middleware)));
    router.post("/", this.traineesController.createTrainee.bind(this.traineesController));
    router.get("/:id", this.traineesController.getTrainee.bind(this.traineesController));
    router.patch("/:id", this.traineesController.updateTrainee.bind(this.traineesController));
    router.delete("/:id", this.traineesController.deleteTrainee.bind(this.traineesController));

    router.get('/:id/profile-picture', this.traineesController.getProfilePicture.bind(this.traineesController));
    router.put('/:id/profile-picture', this.traineesController.setProfilePicture.bind(this.traineesController));
    router.delete('/:id/profile-picture', this.traineesController.deleteProfilePicture.bind(this.traineesController));

    return router;
  }
}
