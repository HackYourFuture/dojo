import { Router } from 'express';
import Middleware from '../middlewares/Middleware';

import type UserController from '../controllers/User/UserController.d';
import type RouterType from './Router';

export class UserRouter implements RouterType {
  constructor(
    private readonly userController: UserController,
    private readonly middlewares: Middleware[]
  ) {}

  build: RouterType['build'] = () => {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));

    router.get('/', this.userController.getAllUsers);
    router.post('/', this.userController.createUser);
    router.put('/:id', this.userController.updateUser);
    router.delete('/:id', this.userController.deleteUser);

    return router;
  };
}
