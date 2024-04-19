import mongoose from "mongoose";
import { UserSchema } from "../schemas";
import { User } from "../models";

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
