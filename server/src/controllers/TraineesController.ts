import { Request, Response } from "express";
import { Trainee } from "../models/Trainee";

export interface TraineesControllerType {
  getTrainee(req: Request, res: Response): void;
  createTrainee(req: Request, res: Response): void;
  updateTrainee(req: Request, res: Response): void;
  deleteTrainee(req: Request, res: Response): void;
}

export class TraineesController {
  constructor() {}

  getTrainee(req: Request, res: Response) {
    res.status(200).json(fakeTrainee);
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

const fakeTrainee: Trainee = {
  id: "hy0eLu",
  personalInfo: {
    firstName: "Emma",
    lastName: "Smith",
    gender: "female"
  },
  contactInfo: {
    email: "emma@gmail.com",
    slack: "emma.sm",
    github: "emma-dev",
  },
  educationInfo: {
    startCohort: 48,
    currentCohort: 48,
    learningStatus: "studying",
    strikes: [],
    assignments: [],
    tests: [],
  },
  employmentInfo: {
    status: "Still studying",
    employmentHistory: [],
  },
  interactions: [],
}
