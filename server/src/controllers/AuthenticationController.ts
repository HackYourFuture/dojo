import { GoogleOAuthServiceType, GoogleOAuthUserInfo, TokenServiceType } from '../services';
import { UserRepository } from '../repositories';
import { User } from '../models';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../errors';
import * as Sentry from '@sentry/node';

export interface LoginParams {
  authCode: string;
  redirectURI: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export interface AuthenticationControllerType {
  login(params: LoginParams): Promise<LoginResult>;
}

/**
 * Handles user authentication: verifies Google OAuth credentials, ensures the
 * user is authorized to access the system, and issues a JWT for the session.
 */
export class AuthenticationController implements AuthenticationControllerType {
  private readonly userRepository: UserRepository;
  private readonly googleOAuthService: GoogleOAuthServiceType;
  private readonly tokenService: TokenServiceType;

  constructor(
    userRepository: UserRepository,
    googleOAuthService: GoogleOAuthServiceType,
    tokenService: TokenServiceType
  ) {
    this.userRepository = userRepository;
    this.googleOAuthService = googleOAuthService;
    this.tokenService = tokenService;
  }

  async login({ authCode, redirectURI }: LoginParams): Promise<LoginResult> {
    if (!authCode || !redirectURI) {
      throw new BadRequestError('Code and redirectURI are required');
    }

    if (!this.isValidRedirectURI(redirectURI)) {
      throw new BadRequestError('Invalid redirectURI');
    }

    let oauthUser: GoogleOAuthUserInfo;
    try {
      let googleAccessToken = await this.googleOAuthService.exchangeAuthCodeForToken(authCode, redirectURI);
      oauthUser = await this.googleOAuthService.getUserInfo(googleAccessToken);

      // Revoke Google OAuth token - we don't use it anymore.
      // Do not wait for the response. Continue with login process.
      this.googleOAuthService.revokeToken(googleAccessToken);
      googleAccessToken = '';

      if (!oauthUser || !oauthUser.emailVerified) {
        throw new Error('Could not verify google auth code');
      }
    } catch (error) {
      Sentry.captureException(error);
      throw new UnauthorizedError('Could not verify user');
    }

    const user = await this.userRepository.findUserByEmail(oauthUser.email);
    if (!user || !user.isActive) {
      Sentry.setUser({ email: oauthUser.email });
      Sentry.captureMessage(`Attempt to login with unauthorized user`, 'warning');
      throw new ForbiddenError('Not allowed to login');
    }

    const token = this.tokenService.generateAccessToken(user);
    return { user, token };
  }

  private isValidRedirectURI(redirectURI: string): boolean {
    const allowedHosts = ['localhost', 'dojo-test.hackyourfuture.net', 'dojo.hackyourfuture.net'];

    try {
      const url = new URL(redirectURI);
      return allowedHosts.includes(url.hostname);
    } catch {
      return false;
    }
  }
}
