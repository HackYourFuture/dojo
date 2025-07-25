import mongoose from 'mongoose';
import { UserSchema } from '../schemas';

import type { CreateUser, UpdateUser, User } from '../models';

export interface UserRepository {
  findUserByID(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  getAllUsers(): Promise<User[]>;
  createUser(user: CreateUser): Promise<User>;
  updateUser(id: string, user: Partial<UpdateUser>): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
}

export class MongooseUserRepository implements UserRepository {
  private UserModel: mongoose.Model<User>;

  constructor(db: mongoose.Connection) {
    this.UserModel = db.model<User>('Users', UserSchema);
  }

  async findUserByID(id: string): Promise<User | null> {
    return await this.UserModel.findById(id);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.UserModel.findOne({ email });
  }

  getAllUsers: UserRepository['getAllUsers'] = () => this.UserModel.find();

  createUser: UserRepository['createUser'] = (user: User) => this.UserModel.create(user);

  updateUser: UserRepository['updateUser'] = (id, user) => this.UserModel.findByIdAndUpdate(id, user, { new: true });

  deleteUser: UserRepository['deleteUser'] = (id) => this.UserModel.findByIdAndDelete(id);
}
