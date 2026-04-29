import { UserRepository } from '../repositories';
import { CreateUser, UpdateUser, User } from '../models';
import { ConflictError, NotFoundError } from '../errors';

export interface UserControllerType {
  getAllUsers(): Promise<User[]>;
  createUser(data: CreateUser): Promise<User>;
  updateUser(userId: string, data: UpdateUser): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}

export class UserController implements UserControllerType {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async createUser(data: CreateUser): Promise<User> {
    const existingUser = await this.userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }
    return this.userRepository.createUser(data);
  }

  async updateUser(userId: string, data: UpdateUser): Promise<User> {
    if (data.email) {
      const existingUser = await this.userRepository.findUserByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('Email already in use');
      }
    }

    const updatedUser = await this.userRepository.updateUser(userId, data);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await this.userRepository.deleteUser(userId);
    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }
  }
}
