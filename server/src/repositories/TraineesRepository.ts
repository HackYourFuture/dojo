import mongoose from "mongoose";
import { WithMongoID, Trainee } from "../models";
import { TraineeSchema } from "../schemas";
import { escapeStringRegexp } from "../utils/string";

export interface TraineesRepository {
  searchTrainees(keyword: string, limit: number): Promise<Trainee[]>;
  getTrainee(id: string): Promise<Trainee | null>;
  createTrainee(trainee: Trainee): Promise<Trainee>;
  deleteTrainee(id: string): Promise<void>;
  updateTrainee(trainee: Trainee): Promise<void>;
  isEmailExists(email: string): Promise<boolean>;
  validateTrainee(trainee: Trainee): Promise<void>;
}

export class MongooseTraineesRepository implements TraineesRepository {
  private TraineeModel: mongoose.Model<Trainee & WithMongoID>;

  constructor(db: mongoose.Connection) {
    this.TraineeModel = db.model<Trainee & WithMongoID>("Trainee", TraineeSchema);
  }

  async searchTrainees(keyword: string, limit: number): Promise<Trainee[]> {
    const escapedKeyword = escapeStringRegexp(keyword);
    return await this.TraineeModel.find({
      $or: [
        { "personalInfo.firstName": { $regex: escapedKeyword, $options: "i" } },
        { "personalInfo.lastName": { $regex: escapedKeyword, $options: "i" } },
        { "contactInfo.email": { $regex: escapedKeyword, $options: "i" } },
      ],
    })
      .limit(limit)
      .sort({ updatedAt: -1 });
  }

  async getTrainee(id: string): Promise<Trainee | null> {
    return await this.TraineeModel.findById(id);
  }

  async createTrainee(trainee: Trainee): Promise<Trainee> {
    return await this.TraineeModel.create(trainee);
  }

  async deleteTrainee(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async updateTrainee(trainee: Trainee): Promise<void> {
    await this.TraineeModel.updateOne({ _id: trainee.id }, trainee);
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
