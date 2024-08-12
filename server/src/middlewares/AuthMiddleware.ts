import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../models';
import { TOKEN_COOKIE_NAME } from '../controllers/AuthenticationController';
import { TokenService } from '../services/TokenService';
import Middleware from './Middleware';
import * as Sentry from '@sentry/node';

export class AuthMiddleware implements Middleware {
  private readonly tokenService: TokenService;
  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  handle(req: Request, res: Response, next: NextFunction) {
    const responseError = new ResponseError('Unauthorized');
    const token = this.getTokenFromRequest(req);
    if (!token) {
      res.status(401).json(responseError);
      return;
    }
    try {
      const user = this.tokenService.verifyAccessToken(token);
      res.locals.user = user;
      Sentry.setUser({ id: user.id, email: user.email });
      next();
    } catch (error) {
      res.status(401).json(responseError);
      Sentry.captureException(error);
      return;
    }
  }

  private getTokenFromRequest(req: Request): string | null {
    const tokenFromAuthHeader = req.headers.authorization?.replace('Bearer ', '').trim();
    const tokenFromCookies = req.cookies[TOKEN_COOKIE_NAME] as string | undefined;
    return tokenFromAuthHeader ?? tokenFromCookies ?? null;
  }
}
