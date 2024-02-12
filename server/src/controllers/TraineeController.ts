import { Request, Response } from "express";

export interface TraineeControllerType {
  getTrainee(req: Request, res: Response): void;
  createTrainee(req: Request, res: Response): void;
  updateTrainee(req: Request, res: Response): void;
  deleteTrainee(req: Request, res: Response): void;
}

export class TraineeController {
  constructor() {}

  getTrainee(req: Request, res: Response) {
    res.status(500).send("Not implemented");
  }

  createTrainee(req: Request, res: Response) {
    res.status(500).send("Not implemented");
  }

  updateTrainee(req: Request, res: Response) {
    res.status(500).send("Not implemented");
  }

  deleteTrainee(req: Request, res: Response) {
    res.status(500).send("Not implemented");
  }
}
