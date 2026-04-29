import { Router } from 'express';
import RouterType from './Router';
import { SearchHandlerType } from '../handlers/SearchHandler';
import Middleware from '../middlewares/Middleware';

export class SearchRouter implements RouterType {
  private readonly handler: SearchHandlerType;
  private readonly middlewares: Middleware[];

  constructor(handler: SearchHandlerType, middlewares: Middleware[] = []) {
    this.handler = handler;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.get('/', this.handler.search.bind(this.handler));
    return router;
  }
}
