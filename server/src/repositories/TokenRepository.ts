import mongoose from 'mongoose';
import { Token } from '../models';
import { TokenSchema } from '../schemas';

export interface TokenRepository {
  addToken(token: Token): Promise<void>;
  findToken(payload: string): Promise<Token | null>;
}

export class MongooseTokenRepository implements TokenRepository {
  private TokenModel: mongoose.Model<Token>;

  constructor(db: mongoose.Connection) {
    this.TokenModel = db.model<Token>('Token', TokenSchema);
  }

  async addToken(token: Token) {
    await this.TokenModel.create(token);
  }

  async findToken(payload: string): Promise<Token | null> {
    return await this.TokenModel.findOne({ payload });
  }
}
