import { Router } from "express";
import RouterType from "./Router";
import { AuthenticationControllerType } from "../controllers/AuthenticationController";

export default class AuthenticationRouter implements RouterType {
  private authenticationController: AuthenticationControllerType;

  constructor(authenticationController: AuthenticationControllerType) {
    this.authenticationController = authenticationController;
  }

  build(): Router {
    const router = Router();
    router.post("/login", this.authenticationController.login.bind(this.authenticationController));
    return router;
  }
}
