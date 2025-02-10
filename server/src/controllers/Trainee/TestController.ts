import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../../models';

export interface TestControllerType {
  getTests(req: Request, res: Response, next: NextFunction): Promise<void>;
  addTest(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTest(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class TestController implements TestControllerType {
  constructor() {}

  async getTests(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(500).send(new ResponseError('Not implemented'));
  }

  async addTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(500).send(new ResponseError('Not implemented'));
  }

  async updateTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(500).send(new ResponseError('Not implemented'));
  }

  async deleteTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(500).send(new ResponseError('Not implemented'));
  }
}
