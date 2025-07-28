import mongoose from 'mongoose';
import { UserSchema } from '../schemas';

import type { CreateUser, UpdateUser, User } from '../models';

export interface UserRepository {
  findUserByID(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  getAllUsers(): Promise<User[]>;
  createUser(user: CreateUser): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
}

export class MongooseUserRepository implements UserRepository {
  private UserModel: mongoose.Model<User>;

  constructor(db: mongoose.Connection) {
    this.UserModel = db.model<User>('Users', UserSchema);

    this.getAllUsers = this.getAllUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  findUserByID(id: string) {
    return this.UserModel.findById(id);
  }

  findUserByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  getAllUsers() {
    return this.UserModel.find();
  }

  createUser(user: CreateUser) {
    return this.UserModel.create(user);
  }

  updateUser(id: string, user: UpdateUser) {
    return this.UserModel.findByIdAndUpdate(id, user, { new: true });
  }

  deleteUser(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
}
