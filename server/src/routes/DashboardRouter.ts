import { Router } from "express";
import RouterType from "./Router";
import { DashboardControllerType } from "../controllers/DashboardController";
import Middleware from "../middlewares/Middleware";

export class DashboardRouter implements RouterType {
  private readonly dashboardController: DashboardControllerType;
  private readonly middlewares: Middleware[];

  constructor(dashboardController: DashboardControllerType, middlewares: Middleware[] = []) {
    this.dashboardController = dashboardController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach(middleware => router.use(middleware.handle.bind(middleware)));
    router.get("/", this.dashboardController.getDashboard.bind(this.dashboardController));
    return router;
  }
}
