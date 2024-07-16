import mongoose from "mongoose";
import { Trainee, StrikeWithReporter, StrikeWithReporterID, StrikeReason } from "../models";
import { TraineeSchema } from "../schemas";
import { escapeStringRegexp } from "../utils/string";
import { WithMongoID } from "../utils/database";
import { UserRepository } from "./UserRepository";

export interface TraineesRepository {
  searchTrainees(keyword: string, limit: number): Promise<Trainee[]>;
  getTrainee(id: string): Promise<Trainee | null>;
  createTrainee(trainee: Trainee): Promise<Trainee>;
  deleteTrainee(id: string): Promise<void>;
  updateTrainee(trainee: Trainee): Promise<void>;
  isEmailExists(email: string): Promise<boolean>;
  validateTrainee(trainee: Trainee): Promise<void>;

  getStrikes(traineeID: string): Promise<StrikeWithReporter[]>;
  addStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  updateStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  deleteStrike(traineeID: string, strikeID: string): Promise<void>;
  validateStrike(strike: StrikeWithReporterID): Promise<void>;
}

export class MongooseTraineesRepository implements TraineesRepository {
  private readonly TraineeModel: mongoose.Model<Trainee & WithMongoID>;
  private readonly userRepository: UserRepository;

  constructor(db: mongoose.Connection, userRepository: UserRepository) {
    this.TraineeModel = db.model<Trainee & WithMongoID>("Trainee", TraineeSchema);
    this.userRepository = userRepository;
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
    return await this.TraineeModel
      .findById(id)
      .populate("educationInfo.strikes.reporterID", "name imageUrl");
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

  async getStrikes(traineeID: string): Promise<StrikeWithReporter[]> {
    const trainee = await this.TraineeModel
      .findById(traineeID)
      .populate("educationInfo.strikes.reporterID", "name imageUrl")
      .select("educationInfo.strikes")
      .exec();

    if (!trainee) {
      throw new Error("Trainee not found");
    }

    return trainee.educationInfo.strikes || [];
  }

  async addStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter> {
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID },
      { $push: { "educationInfo.strikes": strike } },
      { new: true }
    )
    .populate("educationInfo.strikes.reporterID", "name imageUrl");

    if (!updatedTrainee) {
      throw new Error("Trainee not found");
    }

    return updatedTrainee.educationInfo.strikes.at(-1) as StrikeWithReporter;
  }

  async updateStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter> {
    const DBStrike: StrikeWithReporterID & WithMongoID = { _id: strike.id, ...strike };
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID, "educationInfo.strikes._id": strike.id },
      { $set: { "educationInfo.strikes.$": DBStrike } }
    )
    .populate("educationInfo.strikes.reporterID", "name imageUrl");

    if (!updatedTrainee) {
      throw new Error("Trainee not found");
    }

    return updatedTrainee.educationInfo.strikes.find((strike) => (strike as StrikeWithReporter & WithMongoID)._id === DBStrike._id) as StrikeWithReporter;
  }

  async deleteStrike(traineeID: string, strikeID: string): Promise<void> {
    await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID },
      { $pull: { "educationInfo.strikes": { _id: strikeID } } }
    );
  }

  async validateStrike(strike: StrikeWithReporterID): Promise<void> {
    if(!strike.date) {
      throw new Error("Strike date is required");
    }
    if(!strike.reporterID) {
      throw new Error("Strike reporter ID is required");
    }
    if(!strike.reason) {
      throw new Error("Strike reason is required");
    }
    if(!Object.values(StrikeReason).includes(strike.reason)) {
      throw new Error("Unknown strike reason");
    }
    if(!strike.comments) {
      throw new Error("Strike comments are required");
    }
    if(await this.userRepository.findUserByID(strike.reporterID) === null) {
      throw new Error("Invalid strike reporter ID");
    }
  }
}
