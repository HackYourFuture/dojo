import { Router } from "express";
import RouterType from "./Router";
import { TraineesControllerType } from "../controllers/TraineesController";

export default class TraineesRouter implements RouterType {
  private traineesController: TraineesControllerType;

  constructor(traineesController: TraineesControllerType) {
    this.traineesController = traineesController;
  }

  build(): Router {
    const router = Router();
    router.post("/", this.traineesController.createTrainee.bind(this.traineesController));
    router.get("/:id", this.traineesController.getTrainee.bind(this.traineesController));
    router.patch("/:id", this.traineesController.updateTrainee.bind(this.traineesController));
    router.delete("/:id", this.traineesController.deleteTrainee.bind(this.traineesController));
    return router;
  }
}
