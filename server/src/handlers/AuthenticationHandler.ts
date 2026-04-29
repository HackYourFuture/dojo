import { Request, Response, NextFunction } from 'express';
import { AuthenticationControllerType } from '../controllers/AuthenticationController';
import { AuthenticatedUser } from '../models';
import { sendError } from './Handler';

export const TOKEN_COOKIE_NAME = 'dojo_token';

export interface AuthenticationHandlerType {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getSession(req: Request, res: Response): Promise<void>;
}

export class AuthenticationHandler implements AuthenticationHandlerType {
  private readonly controller: AuthenticationControllerType;
  private readonly tokenExpirationInDays: number;

  constructor(controller: AuthenticationControllerType, tokenExpirationInDays: number) {
    this.controller = controller;
    this.tokenExpirationInDays = tokenExpirationInDays;
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authCode = req.body?.authCode?.trim() ?? '';
    const redirectURI = req.body?.redirectURI?.trim() ?? '';

    try {
      const { user, token } = await this.controller.login({ authCode, redirectURI });

      const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
      res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * this.tokenExpirationInDays,
      });
      res.status(200).json(user);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async getSession(_req: Request, res: Response): Promise<void> {
    const user = res.locals.user as AuthenticatedUser;
    res.status(200).json(user);
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie(TOKEN_COOKIE_NAME);
    res.status(204).end();
  }
}
