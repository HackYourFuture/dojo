import { Router } from "express";
import RouterType from "./Router";
import { AuthenticationControllerType } from "../controllers/AuthenticationController";
import Middleware from "../middlewares/Middleware";

export default class AuthenticationRouter implements RouterType {
  private readonly authenticationController: AuthenticationControllerType;
  private readonly authMiddleware: Middleware;
  private readonly middlewares: Middleware[];

  constructor(authenticationController: AuthenticationControllerType, authMiddleware: Middleware, middlewares: Middleware[] = []) {
    this.authenticationController = authenticationController;
    this.middlewares = middlewares;
    this.authMiddleware = authMiddleware;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach(middleware => router.use(middleware.handle.bind(middleware)));
    router.post("/login", this.authenticationController.login.bind(this.authenticationController));
    router.post("/logout", 
      this.authMiddleware.handle.bind(this.authMiddleware), 
      this.authenticationController.logout.bind(this.authenticationController)
    );
    router.get("/session", 
      this.authMiddleware.handle.bind(this.authMiddleware), 
      this.authenticationController.getSession.bind(this.authenticationController)
    );
    return router;
  }
}
