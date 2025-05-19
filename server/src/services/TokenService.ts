import { User, AuthenticatedUser } from '../models';
import JWT from 'jsonwebtoken';

export interface TokenServiceType {
  generateAccessToken(user: User): string;
  verifyAccessToken(token: string): AuthenticatedUser;
}

export class TokenService implements TokenServiceType {
  private readonly secret: string;
  private readonly expiration: JWT.SignOptions['expiresIn'];
  private readonly ALGORITHM = 'HS512';

  constructor(secret: string, expirationInDays: number) {
    if (!secret || secret.length < 16) {
      throw new Error('JWT Secret is required');
    }
    this.secret = secret;
    this.expiration = `${expirationInDays}d`;
  }

  generateAccessToken(user: User): string {
    const plainObject: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    };

    const signOptions: JWT.SignOptions = {
      algorithm: this.ALGORITHM,
      expiresIn: this.expiration,
    };

    return JWT.sign(plainObject, this.secret, signOptions);
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    const { id, email, name, imageUrl } = JWT.verify(token, this.secret) as AuthenticatedUser;
    return { id, email, name, imageUrl } as AuthenticatedUser;
  }
}
