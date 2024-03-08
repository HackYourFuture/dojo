import { Request, Response, NextFunction } from "express";
import { TraineesRepository } from "../repositories/TraineesRepository";
import ResponseError from "../models/ResponseError";
import { Trainee } from "../models/Trainee";

export interface TraineesControllerType {
  getTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
  createTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTrainee(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class TraineesController implements TraineesControllerType {
  private traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }

  async getTrainee(req: Request, res: Response, next: NextFunction) {
    const traineeId = req.params.id;    
    // TODO: check if trainee id is a valid object id
    try {
      const trainee = await this.traineesRepository.getTrainee(traineeId);
      if (!trainee) {
        res.status(404).send(new ResponseError("Trainee not found"));
        return;
      }
      res.status(200).json(trainee);
    } catch (error: any) {
      next(error);
    }
  }

  async createTrainee(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    body.educationInfo = body.educationInfo ?? {};
    body.employmentInfo = body.employmentInfo ?? {};

    // Check if the request is valid
    try {
      await this.traineesRepository.validateTrainee(req.body);
    } catch (error: any) {
      const message: string = `Invalid trainee information. ` + error.message;
      res.status(400).json(new ResponseError(message));
      return;
    }

    // Check if there is another trainee with the same email
    const email = req.body.contactInfo.email;
    let emailExists: boolean = false;
    try {
      emailExists = await this.traineesRepository.isEmailExists(email)
    } catch (error: any) {
      next(error);
      return;
    }
    if (emailExists) {
      const message: string = `There is already another trainee in the system with the email ${email}`;
      res.status(400).json(new ResponseError(message));
      return;
    }

    // Create new trainee and return it
    try {
      const newTrainee = await this.traineesRepository.createTrainee(req.body);
      res.status(201).json(newTrainee);
    } catch (error: any) {
      res.status(500).send(new ResponseError(error.message));
    }
  }

  async updateTrainee(req: Request, res: Response, next: NextFunction) {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError("Trainee not found"));
      return;
    }
    
    // Update all properties
    if(req.body.contactInfo) {
      Object.assign(trainee.contactInfo, req.body.contactInfo);
    }

    // Validate new trainee model
    try {
      await this.traineesRepository.validateTrainee(trainee);
    } catch (error: any) {
      res.status(400).send(new ResponseError(error.message));
      return;
    }

    // Save
    try {
      await this.traineesRepository.updateTrainee(trainee);
      res.status(200).json(trainee);
    } catch (error: any) {
      res.status(500).send(new ResponseError(error.message));
    }
  }

  async deleteTrainee(req: Request, res: Response, next: NextFunction) {
    res.status(500).send("Not implemented");
  }
}
