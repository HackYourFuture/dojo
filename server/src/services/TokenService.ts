import { User, AuthenticatedUser } from "../models/User";
import JWT from "jsonwebtoken";

export interface TokenServiceType {
  generateAccessToken(user: User): string;
  verifyAccessToken(token: string): AuthenticatedUser;
}

export class TokenService implements TokenServiceType {
  private secret: string;
  private readonly ALGORITHM = "HS512";
  private readonly EXPIRATION = "7d";

  constructor(secret: string) {
    if (!secret || secret.length < 16) {
      throw new Error("JWT Secret is required");
    }
    this.secret = secret;
  }

  generateAccessToken(user: User): string {
    const plainObject: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    };
    return JWT.sign(plainObject, this.secret, {
      algorithm: this.ALGORITHM,
      expiresIn: this.EXPIRATION,
    });
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    return JWT.verify(token, this.secret) as AuthenticatedUser;
  }
}
