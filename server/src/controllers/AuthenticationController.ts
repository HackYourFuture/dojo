import { Request, Response } from "express";
import { GoogleOAuthServiceType, GoogleOAuthUserInfo, TokenServiceType } from "../services";
import { UserRepository, TokenRepository } from "../repositories";
import { TokenType, ResponseError, AuthenticatedUser } from "../models";
import crypto from "crypto";

export interface AuthenticationControllerType {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getSession(req: Request, res: Response): Promise<void>;
}

export const TOKEN_COOKIE_NAME = "dojo_token";

export class AuthenticationController implements AuthenticationControllerType {
  private readonly userRepository: UserRepository;
  private readonly tokenRepository: TokenRepository;
  private readonly googleOAuthService: GoogleOAuthServiceType;
  private readonly tokenService: TokenServiceType;
  private readonly tokenExpirationInDays: number;

  constructor(
    userRepository: UserRepository,
    tokenRepository: TokenRepository,
    googleOAuthService: GoogleOAuthServiceType,
    tokenService: TokenServiceType,
    tokenExpirationInDays: number
  ) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.googleOAuthService = googleOAuthService;
    this.tokenService = tokenService;
    this.tokenExpirationInDays = tokenExpirationInDays;
  }

  async login(req: Request, res: Response) {
    const googleAccessToken = req.body.token?.trim();
    if (!googleAccessToken) {
      res.status(400).json(new ResponseError("Access token is required"));
      return;
    }

    // Verify access token against Google OAuth service
    let oauthUser: GoogleOAuthUserInfo;
    try {
      oauthUser = await this.googleOAuthService.getUserInfo(googleAccessToken);
      if (!oauthUser || !oauthUser.emailVerified) {
        throw new Error("Could not verify user");
      }
    } catch (error) {
      res.status(401).json(new ResponseError("Could not verify user"));
      return;
    }

    // Check if the token has already been used
    if(await this.checkForUsedGoogleAccessToken(googleAccessToken)) {
      res.status(401).json(new ResponseError("Access token has already been used"));
      return;
    }
    
    // Check if the user is allowed to access to the system
    const user = await this.userRepository.findUserByEmail(oauthUser.email);
    if (!user || !user.isActive) {
      res.status(403).json(new ResponseError("Not allowed to login"));
      return;
    }
    
    // Login Successful!
    // Invalidate google access token - this will prevent the same token from being used again
    await this.invalidateGoogleAccessToken(googleAccessToken);

    // Generate and send JWT token
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

  // Check if the google access token has already been used in a previous login
  private async checkForUsedGoogleAccessToken(accessToken: string) {
    const hashedToken = crypto.createHash('sha256').update(accessToken).digest('hex');
    const token = await this.tokenRepository.findToken(hashedToken);
    const hasAlreadyBeenUsed = token && !token.isValid;
    return hasAlreadyBeenUsed;
  }
    
  // Save the google access token to the database to prevent it from being used again
  private async invalidateGoogleAccessToken(accessToken: string) {
    // Hash the token. We don't want to store secrets in the database if we don't have to.
    const hashedToken = crypto.createHash('sha256').update(accessToken).digest('hex');
    await this.tokenRepository.addToken({
      createdAt: new Date(),
      type: TokenType.GoogleAccessTokenHash,
      payload: hashedToken,
      isValid: false,
    });
  }
}
