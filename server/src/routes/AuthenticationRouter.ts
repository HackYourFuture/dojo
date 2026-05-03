import { Router } from 'express';
import RouterType from './Router';
import { AuthenticationHandlerType } from '../handlers/AuthenticationHandler';
import Middleware from '../middlewares/Middleware';

export class AuthenticationRouter implements RouterType {
  private readonly handler: AuthenticationHandlerType;
  private readonly authMiddleware: Middleware;
  private readonly middlewares: Middleware[];

  constructor(handler: AuthenticationHandlerType, authMiddleware: Middleware, middlewares: Middleware[] = []) {
    this.handler = handler;
    this.middlewares = middlewares;
    this.authMiddleware = authMiddleware;
  }

  build(): Router {
    const router = Router();
    this.middlewares.forEach((middleware) => router.use(middleware.handle.bind(middleware)));
    router.post('/login', this.handler.login.bind(this.handler));
    router.post(
      '/logout',
      this.authMiddleware.handle.bind(this.authMiddleware),
      this.handler.logout.bind(this.handler)
    );
    router.get(
      '/session',
      this.authMiddleware.handle.bind(this.authMiddleware),
      this.handler.getSession.bind(this.handler)
    );
    return router;
  }
}
