import { RequestHandler } from "express";

export default interface UserController {
  getAllUsers: RequestHandler;
  createUser: RequestHandler;
  updateUser: RequestHandler;
  deleteUser: RequestHandler;
}
