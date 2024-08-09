import { Router } from 'express';
import RouterType from './Router';
import { SearchControllerType } from '../controllers/SearchController';
import Middleware from '../middlewares/Middleware';

export class SearchRouter implements RouterType {
  private readonly searchController: SearchControllerType;
  private readonly middlewares: Middleware[];

  constructor(searchController: SearchControllerType, middlewares: Middleware[] = []) {
    this.searchController = searchController;
    this.middlewares = middlewares;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.get('/', this.searchController.search.bind(this.searchController));
    return router;
  }
}
