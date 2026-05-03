import { Request, Response, NextFunction } from 'express';
import { TestControllerType } from '../controllers/Trainee/TestController';
import { Test } from '../models';
import { sendError } from './Handler';

export interface TestHandlerType {
  getTests(req: Request, res: Response, next: NextFunction): Promise<void>;
  addTest(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTest(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class TestHandler implements TestHandlerType {
  constructor(private readonly controller: TestControllerType) {}

  async getTests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tests = await this.controller.getTests(String(req.params.id));
      res.status(200).json(tests);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async addTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const test = req.body as Test;
    try {
      const created = await this.controller.addTest(String(req.params.id), test);
      res.status(201).json(created);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async updateTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const test: Test = {
      id: String(req.params.testID),
      date: req.body?.date,
      type: req.body?.type,
      result: req.body?.result,
      score: Number.parseFloat(req.body?.score),
      comments: req.body?.comments,
    };

    try {
      const updated = await this.controller.updateTest(String(req.params.id), test);
      res.status(200).json(updated);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.controller.deleteTest(String(req.params.id), String(req.params.testID));
      res.status(204).end();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
