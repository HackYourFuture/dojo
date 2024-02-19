import { Request, Response } from "express";
import { Trainee } from "../models/Trainee";
import { TraineesRepository } from "../repositories/TraineesRepository";

export interface TraineesControllerType {
  getTrainee(req: Request, res: Response): Promise<void>;
  createTrainee(req: Request, res: Response): Promise<void>;
  updateTrainee(req: Request, res: Response): Promise<void>;
  deleteTrainee(req: Request, res: Response): Promise<void>;
}

export class TraineesController {
  private traineeRepository: TraineesRepository;
  constructor(traineeRepository: TraineesRepository) {
    this.traineeRepository = traineeRepository;
  }

  async getTrainee(req: Request, res: Response) {
    res.status(200).json(fakeTrainee);
  }

  async createTrainee(req: Request, res: Response) {
    try {
      const newTrainee = await this.traineeRepository.createTrainee(req.body);
      res.status(201).json(newTrainee);
    } catch (error: any) {
      const allErrors = Object.keys(error.errors).map((key) => error.errors[key].message ).join(" ");
      console.error(error);
      res.status(400).send({ error: allErrors });
    }
  }

  async updateTrainee(req: Request, res: Response) {
    res.status(500).send("Not implemented");
  }

  async deleteTrainee(req: Request, res: Response) {
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
