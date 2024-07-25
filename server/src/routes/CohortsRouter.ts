import { Router } from "express";
import RouterType from "./Router";
import { CohortsControllerType } from "../controllers/CohortsController";
import Middleware from "../middlewares/Middleware";

export class CohortsRouter implements RouterType {
  private readonly cohortsController: CohortsControllerType;
  private readonly middlewares: Middleware[];

  constructor(cohortsController: CohortsControllerType, middlewares: Middleware[] = []) {
    this.cohortsController = cohortsController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach(middleware => router.use(middleware.handle.bind(middleware)));
    router.get("/", this.cohortsController.getCohorts.bind(this.cohortsController));
    return router;
  }
}
