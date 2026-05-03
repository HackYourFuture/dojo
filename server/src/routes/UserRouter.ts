import { Router } from 'express';
import Middleware from '../middlewares/Middleware';
import type { UserHandlerType } from '../handlers/UserHandler';
import type RouterType from './Router';

export class UserRouter implements RouterType {
  constructor(
    private readonly handler: UserHandlerType,
    private readonly middlewares: Middleware[]
  ) {}

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));

    router.get('/', this.handler.getAllUsers.bind(this.handler));
    router.post('/', this.handler.createUser.bind(this.handler));
    router.put('/:id', this.handler.updateUser.bind(this.handler));
    router.delete('/:id', this.handler.deleteUser.bind(this.handler));

    return router;
  }
}
