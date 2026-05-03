import { Router } from 'express';
import RouterType from './Router';
import { GeographyHandlerType } from '../handlers/GeographyHandler';
import Middleware from '../middlewares/Middleware';

export class GeographyRouter implements RouterType {
  private readonly handler: GeographyHandlerType;
  private readonly middlewares: Middleware[];

  constructor(handler: GeographyHandlerType, middlewares: Middleware[] = []) {
    this.handler = handler;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.get('/cities', this.handler.getCities.bind(this.handler));
    router.get('/countries', this.handler.getCountries.bind(this.handler));
    return router;
  }
}
