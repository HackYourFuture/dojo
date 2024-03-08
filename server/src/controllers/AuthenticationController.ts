import { Request, Response } from "express";
import ResponseError from "../models/ResponseError";

export interface AuthenticationControllerType {
  login(req: Request, res: Response): Promise<void>;
}

export class AuthenticationController implements AuthenticationControllerType {
  constructor() {
  }

  async login(req: Request, res: Response) {
    res.status(500).json(new ResponseError("Not implemented"));
  }
}
