import { Router } from 'express';
import RouterType from './Router';
import { CohortsHandlerType } from '../handlers/CohortsHandler';
import Middleware from '../middlewares/Middleware';

export class CohortsRouter implements RouterType {
  private readonly cohortsHandler: CohortsHandlerType;
  private readonly middlewares: Middleware[];

  constructor(cohortsHandler: CohortsHandlerType, middlewares: Middleware[] = []) {
    this.cohortsHandler = cohortsHandler;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.get('/', this.cohortsHandler.getCohorts.bind(this.cohortsHandler));
    return router;
  }
}
