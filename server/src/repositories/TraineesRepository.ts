import { Trainee } from "../models/Trainee";
import TraineeSchema from "../schemas/TraineeSchema";
import mongoose from "mongoose";

export interface TraineesRepository {
  searchTrainees(keyword: string): Promise<Trainee[]>;
  getTrainee(id: string): Promise<Trainee | null>;
  createTrainee(trainee: Trainee): Promise<Trainee>;
  deleteTrainee(id: string): Promise<void>;
  updateTrainee(trainee: Trainee): Promise<void>;
  isEmailExists(email: string): Promise<boolean>;
  validateTrainee(trainee: Trainee): Promise<void>;
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await this.TraineeModel.findById(id);
  }

  async createTrainee(trainee: Trainee): Promise<Trainee> {
    return await this.TraineeModel.create(trainee);
  }

  async deleteTrainee(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async updateTrainee(trainee: Trainee): Promise<void> {
    throw new Error("Not implemented");
  }

  async isEmailExists(email: string): Promise<boolean> {
    const result = await this.TraineeModel.exists({
      "contactInfo.email": email,
    });
    return result !== null;
  }

  async validateTrainee(trainee: Trainee): Promise<void> {
    await this.TraineeModel.validate(trainee);
  }
}
