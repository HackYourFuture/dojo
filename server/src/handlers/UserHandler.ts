import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { UserControllerType } from '../controllers/UserController';
import { CreateUserSchema, UpdateUserSchema } from '../models';
import { sendError } from './Handler';

export interface UserHandlerType {
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class UserHandler implements UserHandlerType {
  constructor(private readonly controller: UserControllerType) {}

  async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.controller.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = CreateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(z.flattenError(parsed.error));
      return;
    }

    try {
      const createdUser = await this.controller.createUser(parsed.data);
      res.status(201).json(createdUser);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = String(req.params.id);
    const parsed = UpdateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(z.flattenError(parsed.error));
      return;
    }

    try {
      const updatedUser = await this.controller.updateUser(userId, parsed.data);
      res.status(200).json(updatedUser);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = String(req.params.id);
    try {
      await this.controller.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
