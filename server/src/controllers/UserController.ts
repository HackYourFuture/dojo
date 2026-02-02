import z from 'zod';
import { UserRepository } from '../repositories';
import { ResponseError } from '../models';
import { CreateUserSchema, UpdateUserSchema } from '../models';

import type { RequestHandler, Request, Response } from 'express';

export interface UserController {
  getAllUsers: RequestHandler;
  createUser: RequestHandler;
  updateUser: RequestHandler;
  deleteUser: RequestHandler;
}

export class DefaultUserController implements UserController {
  constructor(private userRepository: UserRepository) {
    this.getAllUsers = this.getAllUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * GET /users
   * get all users
   * 200 | 500
   */
  async getAllUsers(req: Request, res: Response) {
    const users = await this.userRepository.getAllUsers();
    res.status(200).json(users);
  }

  /**
   * POST /users
   * create a new user
   * 201 | 400 | 409 | 500
   */
  async createUser(req: Request, res: Response) {
    //validate
    const user = CreateUserSchema.safeParse(req.body);
    if (!user.success) {
      res.status(400).json(z.flattenError(user.error));
      return;
    }

    //check if email already exists
    const existingUser = await this.userRepository.findUserByEmail(user.data.email);
    if (existingUser) {
      res.status(409).json(new ResponseError('Email already in use'));
      return;
    }

    //create user
    const createdUser = await this.userRepository.createUser(user.data);
    res.status(201).json(createdUser);
  }

  /**
   * PUT /users/{id}
   * update an existing user
   * 200 | 400 | 404 | 500
   */
  async updateUser(req: Request, res: Response) {
    const userId = String(req.params.id);

    //validate
    const userUpdates = UpdateUserSchema.safeParse(req.body);
    if (!userUpdates.success) {
      res.status(400).json(z.flattenError(userUpdates.error));
      return;
    }

    //check if email already exists if provided
    if (userUpdates.data.email) {
      const existingUser = await this.userRepository.findUserByEmail(userUpdates.data.email);
      if (existingUser && existingUser.id !== userId) {
        res.status(409).json(new ResponseError('Email already in use'));
        return;
      }
    }

    //update user
    const updatedUser = await this.userRepository.updateUser(userId, userUpdates.data);
    if (!updatedUser) {
      res.status(404).json(new ResponseError('User not found'));
    } else {
      res.status(200).json(updatedUser);
    }
  }

  /**
   * DELETE /users/{id}
   * delete an existing user
   * 204 | 404 | 500
   */
  async deleteUser(req: Request, res: Response) {
    const userId = String(req.params.id);

    const deletedUser = await this.userRepository.deleteUser(userId);
    if (!deletedUser) {
      res.status(404).json(new ResponseError('User not found'));
      return;
    }

    res.status(204).send();
  }
}
