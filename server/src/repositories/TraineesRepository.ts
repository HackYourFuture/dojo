import { Trainee } from "../models/Trainee";
import TraineeSchema from "../schemas/TraineeSchema";
import mongoose from "mongoose";

export interface TraineesRepository {
  searchTrainees(keyword: string): Promise<Trainee[]>;
  getTrainee(id: string): Promise<Trainee | null>;
  createTrainee(trainee: Trainee): Promise<Trainee>;
  deleteTrainee(id: string): Promise<void>;
  updateTrainee(trainee: Trainee): Promise<void>;
}

export class MongooseTraineesRepository implements TraineesRepository {
  private TraineeModel: mongoose.Model<Trainee>;

  constructor(db: mongoose.Connection) {
    this.TraineeModel = db.model<Trainee>("Trainee", TraineeSchema);
  }

  async searchTrainees(keyword: string): Promise<Trainee[]> {
    throw new Error("Not implemented");
  }
  async getTrainee(id: string): Promise<Trainee | null> {
    return await this.TraineeModel.findOne({ id });
  }
  async createTrainee(trainee: Trainee): Promise<Trainee> {
    return await this.TraineeModel.create(trainee)
  }
  
  async deleteTrainee(id: string): Promise<void> {
    throw new Error("Not implemented");
  }
  async updateTrainee(trainee: Trainee): Promise<void> {
    throw new Error("Not implemented");
  }
}
