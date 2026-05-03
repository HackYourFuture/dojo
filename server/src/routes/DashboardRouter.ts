import { Router } from 'express';
import RouterType from './Router';
import { DashboardHandlerType } from '../handlers/DashboardHandler';
import Middleware from '../middlewares/Middleware';

export class DashboardRouter implements RouterType {
  private readonly handler: DashboardHandlerType;
  private readonly middlewares: Middleware[];

  constructor(handler: DashboardHandlerType, middlewares: Middleware[] = []) {
    this.handler = handler;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.get('/', this.handler.getDashboard.bind(this.handler));
    return router;
  }
}
