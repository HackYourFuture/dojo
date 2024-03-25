import { Request, Response, NextFunction } from 'express';
import ResponseError from "../models/ResponseError";
import { TOKEN_COOKIE_NAME } from "../controllers/AuthenticationController";
import { TokenService } from '../services/TokenService';
import Middleware from './Middleware';

export default class AuthMiddleware implements Middleware{
  private readonly tokenService: TokenService;
  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  handle(req: Request, res: Response, next: NextFunction) {
    const responseError = new ResponseError("Unauthorized");
    const token = this.getTokenFromRequest(req);
    if(!token) {
      res.status(401).json(responseError);
      return;
    }
    try {
      const user = this.tokenService.verifyAccessToken(token);
      res.locals.user = user;
      next();
    } catch (error) {
      res.status(401).json(responseError);
      return;
    }
  }

  private getTokenFromRequest(req: Request): string | null {
    const tokenFromAuthHeader = req.headers.authorization?.replace("Bearer ", "").trim();
    const tokenFromCookies = req.cookies[TOKEN_COOKIE_NAME] as string | undefined;
    return tokenFromAuthHeader ?? tokenFromCookies ?? null;
  }
}

