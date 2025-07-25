import z from 'zod';
import { UserRepository } from '../../repositories';
import { ResponseError } from '../../models';
import { CreateUserSchema, UpdateUserSchema } from '../../models/User';

import type { RequestHandler } from 'express';
import type UserController from './UserController.d';

export class UserControllerImpl implements UserController {
  constructor(private userRepository: UserRepository) {}

  /**
   * GET /users
   * get all users
   * 200 | 500
   */
  getAllUsers: RequestHandler = async (req, res) => {
    const users = await this.userRepository.getAllUsers();
    res.status(200).json(users);
  };

  /**
   * POST /users
   * create a new user
   * 201 | 400 | 409 | 500
   */
  createUser: RequestHandler = async (req, res) => {
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
  };

  /**
   * PUT /users/{id}
   * update an existing user
   * 200 | 400 | 404 | 500
   */
  updateUser: RequestHandler = async (req, res) => {
    const userId = req.params.id;

    //validate
    const userUpdates = UpdateUserSchema.safeParse(req.body);
    if (!userUpdates.success) {
      res.status(400).json(new ResponseError('Invalid user data'));
      return;
    }

    //update user
    const updatedUser = await this.userRepository.updateUser(userId, userUpdates.data);
    if (!updatedUser) {
      res.status(404).json(new ResponseError('User not found'));
    } else {
      res.status(200).json(updatedUser);
    }
  };

  /**
   * DELETE /users/{id}
   * delete an existing user
   * 204 | 404 | 500
   */
  deleteUser: RequestHandler = async (req, res) => {
    const userId = req.params.id;

    const deletedUser = await this.userRepository.deleteUser(userId);
    if (!deletedUser) {
      res.status(404).json(new ResponseError('User not found'));
    }

    res.status(204).send();
  };
}
