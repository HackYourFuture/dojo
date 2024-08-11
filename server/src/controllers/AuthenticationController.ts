import { Request, Response } from 'express';
import { GoogleOAuthServiceType, GoogleOAuthUserInfo, TokenServiceType } from '../services';
import { UserRepository } from '../repositories';
import { ResponseError, AuthenticatedUser } from '../models';
import * as Sentry from '@sentry/node';

export interface AuthenticationControllerType {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getSession(req: Request, res: Response): Promise<void>;
}

export const TOKEN_COOKIE_NAME = 'dojo_token';

/**
 * A class provides methods for handling user authentication,
 * including login, logout, and session retrieval.
 *
 * @class
 * */
export class AuthenticationController implements AuthenticationControllerType {
  private readonly userRepository: UserRepository;
  private readonly googleOAuthService: GoogleOAuthServiceType;
  private readonly tokenService: TokenServiceType;
  private readonly tokenExpirationInDays: number;

  constructor(
    userRepository: UserRepository,
    googleOAuthService: GoogleOAuthServiceType,
    tokenService: TokenServiceType,
    tokenExpirationInDays: number
  ) {
    this.userRepository = userRepository;
    this.googleOAuthService = googleOAuthService;
    this.tokenService = tokenService;
    this.tokenExpirationInDays = tokenExpirationInDays;
  }

  async login(req: Request, res: Response) {
    const authCode = req.body.authCode?.trim();
    const redirectURI = req.body.redirectURI?.trim();
    if (!authCode || !redirectURI) {
      res.status(400).json(new ResponseError('Code and redirectURI are required'));
      return;
    }

    if (!this.isValidRedirectURI(redirectURI)) {
      res.status(400).json(new ResponseError('Invalid redirectURI'));
      return;
    }

    // Verify user identity against Google OAuth service
    let oauthUser: GoogleOAuthUserInfo;
    try {
      // 1. Exchange authentication code for access token
      let googleAccessToken = await this.googleOAuthService.exchangeAuthCodeForToken(authCode, redirectURI);

      // 2. Get user info from Google
      oauthUser = await this.googleOAuthService.getUserInfo(googleAccessToken);

      // 3. Revoke Google OAuth token - we don't use it anymore.
      // Do not wait for the response. Continue with login process.
      this.googleOAuthService.revokeToken(googleAccessToken);
      googleAccessToken = '';

      if (!oauthUser || !oauthUser.emailVerified) {
        throw new Error('Could not verify google auth code');
      }
    } catch (error) {
      res.status(401).json(new ResponseError('Could not verify user'));
      Sentry.captureException(error);
      return;
    }

    // Check if the user is allowed to access to the system
    const user = await this.userRepository.findUserByEmail(oauthUser.email);
    if (!user || !user.isActive) {
      res.status(403).json(new ResponseError('Not allowed to login'));
      Sentry.setUser({ email: oauthUser.email });
      Sentry.captureMessage(`Attempt to login with unauthorized user`, 'warning');
      return;
    }

    // Login Successful! Generate and send JWT token
    const jwtToken = this.tokenService.generateAccessToken(user);

    // Set the token in a cookie
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie(TOKEN_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * this.tokenExpirationInDays,
    });

    res.status(200).json(user);
  }

  async getSession(req: Request, res: Response): Promise<void> {
    const user = res.locals.user as AuthenticatedUser;
    res.status(200).json(user);
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie(TOKEN_COOKIE_NAME);
    res.status(204).end();
  }

  private isValidRedirectURI(redirectURI: string) {
    const allowedHosts = ['localhost', 'dojo-test.hackyourfuture.net', 'dojo.hackyourfuture.net'];

    try {
      const url = new URL(redirectURI);
      return allowedHosts.includes(url.hostname);
    } catch (error) {
      return false;
    }
  }
}
