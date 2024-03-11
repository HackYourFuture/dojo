import UserSchema from "../schemas/UserSchema";
import mongoose from "mongoose";
import { escapeStringRegexp } from "../utils/string";
import { User } from "../models/User";

export interface UserRepository {
  findUserByEmail(email: string): Promise<User | null>
}

export class MongooseUserRepository implements UserRepository {
  private UserModel: mongoose.Model<User>;

  constructor(db: mongoose.Connection) {
    this.UserModel = db.model<User>("Users", UserSchema);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.UserModel.findOne({ email });
  }
}
