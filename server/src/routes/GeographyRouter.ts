import { Router } from "express";
import RouterType from "./Router";
import { GeographyControllerType } from "../controllers";
import Middleware from "../middlewares/Middleware";

export class GeographyRouter implements RouterType {
  private readonly geographyController: GeographyControllerType;
  private readonly middlewares: Middleware[];

  constructor(geographyController: GeographyControllerType, middlewares: Middleware[] = []) {
    this.geographyController = geographyController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach(middleware => router.use(middleware.handle.bind(middleware)));
    router.get("/cities", this.geographyController.getCities.bind(this.geographyController));
    router.get("/countries", this.geographyController.getCountries.bind(this.geographyController));
    return router;
  }
}
