import { Request, Response } from "express";
import ResponseError from "../models/ResponseError";
import { GoogleOAuthServiceType, GoogleOAuthUserInfo } from "../services/GoogleOAuthService";
import { UserRepository } from "../repositories/UserRepository";

export interface AuthenticationControllerType {
  login(req: Request, res: Response): Promise<void>;
}

export class AuthenticationController implements AuthenticationControllerType {
  private userRepository: UserRepository;
  private googleOAuthService: GoogleOAuthServiceType;

  constructor(userRepository: UserRepository, googleOAuthService: GoogleOAuthServiceType) {
    this.userRepository = userRepository;
    this.googleOAuthService = googleOAuthService;
  }

  async login(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
      res.status(400).json(new ResponseError("Access token is required"));
      return;
    }

    // Verify access token against Google OAuth service
    let oauthUser: GoogleOAuthUserInfo;
    try {
      oauthUser = await this.googleOAuthService.getUserInfo(token);
      if (!oauthUser || !oauthUser.emailVerified) {
        throw new Error("Could not verify user");
      }
    } catch (error) {
      res.status(401).json(new ResponseError("Could not verify user"));
      return;
    }

    // Check if the user is allowed to access to the system
    const user = await this.userRepository.findUserByEmail(oauthUser.email);
    if (!user || !user.isActive) {
      res.status(403).json(new ResponseError("Not allowed to login"));
      return;
    }

    // Successful login - create jwt token and send it back to the client

    // Set up JWT token and set it to http only secure cookie
  

    res.status(200).json(user);
  }
}
