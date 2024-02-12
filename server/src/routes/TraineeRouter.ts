import { Router } from "express";
import RouterType from "./Router";
import { TraineeControllerType } from "../controllers/TraineeController";

export default class TraineeRouter implements RouterType {
  private traineeController: TraineeControllerType;

  constructor(traineeController: TraineeControllerType) {
    this.traineeController = traineeController;
  }

  build(): Router {
    const router = Router();
    router.post("/", this.traineeController.createTrainee);
    router.get("/:id", this.traineeController.getTrainee);
    router.patch("/:id", this.traineeController.updateTrainee);
    router.delete("/:id", this.traineeController.deleteTrainee);
    return router;
  }
}
