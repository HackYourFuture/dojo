import { Request, Response, NextFunction } from 'express';
import { ResponseError, Test } from '../../models';
import { TraineesRepository } from '../../repositories';

export interface TestControllerType {
  getTests(req: Request, res: Response, next: NextFunction): Promise<void>;
  addTest(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTest(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class TestController implements TestControllerType {
  private readonly traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }
  async getTests(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    try {
      const tests = await this.traineesRepository.getTests(trainee.id);
      res.status(200).json(tests);
    } catch (error: any) {
      next(error);
    }
  }

  async addTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const newTest = req.body as Test;

    // Validate new test model before creation
    try {
      await this.traineesRepository.validateTest(newTest);
    } catch (error: any) {
      res.status(400).send(new ResponseError(error.message));
      return;
    }

    try {
      const test = await this.traineesRepository.addTest(trainee.id, newTest);
      res.status(201).json(test);
    } catch (error: any) {
      next(error);
    }
  }

  async updateTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    const test = trainee.educationInfo.tests.find((test) => test.id === req.params.testID);
    if (!test) {
      res.status(404).send(new ResponseError('Test not found'));
      return;
    }

    const testToUpdate: Test = {
      id: req.params.testID,
      date: req.body.date,
      type: req.body.type,
      result: req.body.result,
      score: Number.parseFloat(req.body.score),
      comments: req.body.comments,
    };

    // Validate new test model after applying the changes
    try {
      await this.traineesRepository.validateTest(testToUpdate);
    } catch (error: any) {
      res.status(400).send(new ResponseError(error.message));
      return;
    }

    try {
      const updatedTest = await this.traineesRepository.updateTest(trainee.id, testToUpdate);
      res.status(200).json(updatedTest);
    } catch (error: any) {
      console.error(error);
      next(error);
      return;
    }
  }

  async deleteTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    if (!trainee.educationInfo.tests.find((test) => test.id === req.params.testID)) {
      res.status(404).send(new ResponseError('Test not found'));
      return;
    }

    try {
      await this.traineesRepository.deleteTest(req.params.id, req.params.testID);
      res.status(204).end();
    } catch (error: any) {
      next(error);
      return;
    }
  }
}
