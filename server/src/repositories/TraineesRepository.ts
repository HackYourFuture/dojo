import { InteractionWithReporter, InteractionWithReporterID } from '../models/Interaction';
import { StrikeWithReporter, StrikeWithReporterID, Test, Trainee } from '../models';

import { TraineeSchema } from '../schemas';
import { WithMongoID } from '../utils/database';
import mongoose from 'mongoose';

export interface TraineesRepository {
  getAllTrainees(): Promise<Trainee[]>;
  getTraineesByCohort(
    fromCohort: number | undefined,
    toCohort: number | undefined,
    includeNullCohort: boolean
  ): Promise<Trainee[]>;
  getTrainee(id: string): Promise<Trainee | null>;
  createTrainee(trainee: Trainee): Promise<Trainee>;
  deleteTrainee(id: string): Promise<void>;
  updateTrainee(trainee: Trainee): Promise<void>;
  isEmailExists(email: string): Promise<boolean>;

  getStrikes(traineeID: string): Promise<StrikeWithReporter[]>;
  addStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  updateStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  deleteStrike(traineeID: string, strikeID: string): Promise<void>;

  getInteractions(traineeID: string): Promise<InteractionWithReporter[]>;
  addInteraction(traineeID: string, interaction: InteractionWithReporterID): Promise<InteractionWithReporter>;
  updateInteraction(traineeID: string, interaction: InteractionWithReporterID): Promise<InteractionWithReporter>;
  deleteInteraction(traineeID: string, interactionID: string): Promise<void>;

  getTests(traineeID: string): Promise<Test[]>;
  addTest(traineeID: string, test: Test): Promise<Test>;
  updateTest(traineeID: string, test: Test): Promise<Test>;
  deleteTest(traineeID: string, testID: string): Promise<void>;
}

export class MongooseTraineesRepository implements TraineesRepository {
  private readonly TraineeModel: mongoose.Model<Trainee & WithMongoID>;

  constructor(db: mongoose.Connection) {
    this.TraineeModel = db.model<Trainee & WithMongoID>('Trainee', TraineeSchema);
  }

  async getAllTrainees(): Promise<Trainee[]> {
    return await this.TraineeModel.find().exec();
  }

  async getTraineesByCohort(
    fromCohort: number | undefined,
    toCohort: number | undefined,
    includeNullCohort: boolean = false
  ): Promise<Trainee[]> {
    let condition: any = { 'educationInfo.currentCohort': { $gte: fromCohort ?? 0, $lte: toCohort ?? 999 } };
    if (includeNullCohort) {
      condition = { $or: [condition, { 'educationInfo.currentCohort': null }] };
    }
    return await this.TraineeModel.find(condition)
      .select([
        'thumbnailURL',
        'contactInfo',
        'personalInfo.firstName',
        'personalInfo.lastName',
        'personalInfo.preferredName',
        'personalInfo.location',
        'personalInfo.hasWorkPermit',
        'educationInfo.learningStatus',
        'educationInfo.strikes.id',
        'educationInfo.currentCohort',
        'employmentInfo.jobPath',
      ])
      .sort({ 'educationInfo.currentCohort': 1 })
      .exec();
  }

  async getTrainee(id: string): Promise<Trainee | null> {
    return await this.TraineeModel.findById(id).populate('educationInfo.strikes.reporterID', 'name imageUrl');
  }

  async createTrainee(trainee: Trainee): Promise<Trainee> {
    return await this.TraineeModel.create(trainee);
  }

  async deleteTrainee(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async updateTrainee(trainee: Trainee): Promise<void> {
    await this.TraineeModel.updateOne({ _id: trainee.id }, trainee);
  }

  async isEmailExists(email: string): Promise<boolean> {
    const result = await this.TraineeModel.exists({
      'contactInfo.email': email,
    });
    return result !== null;
  }

  async getStrikes(traineeID: string): Promise<StrikeWithReporter[]> {
    const trainee = await this.TraineeModel.findById(traineeID)
      .populate('educationInfo.strikes.reporterID', 'name imageUrl')
      .select('educationInfo.strikes')
      .exec();

    if (!trainee) {
      throw new Error('Trainee not found');
    }

    return trainee.educationInfo.strikes || [];
  }

  async addStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter> {
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID },
      { $push: { 'educationInfo.strikes': strike } },
      { new: true }
    ).populate('educationInfo.strikes.reporterID', 'name imageUrl');

    if (!updatedTrainee) {
      throw new Error('Trainee not found');
    }

    return updatedTrainee.educationInfo.strikes.at(-1) as StrikeWithReporter;
  }

  async updateStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter> {
    const DBStrike: StrikeWithReporterID & WithMongoID = { _id: strike.id, ...strike };
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID, 'educationInfo.strikes._id': strike.id },
      { $set: { 'educationInfo.strikes.$': DBStrike } },
      { new: true }
    ).populate('educationInfo.strikes.reporterID', 'name imageUrl');

    if (!updatedTrainee) {
      throw new Error('Trainee not found');
    }

    return updatedTrainee.educationInfo.strikes.find((strike) => strike.id === DBStrike._id) as StrikeWithReporter;
  }

  async deleteStrike(traineeID: string, strikeID: string): Promise<void> {
    await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID },
      { $pull: { 'educationInfo.strikes': { _id: strikeID } } }
    );
  }

  async getInteractions(traineeID: string): Promise<InteractionWithReporter[]> {
    const trainee = await this.TraineeModel.findById(traineeID)
      .populate('interactions.reporterID', 'name imageUrl')
      .select('interactions')
      .exec();

    if (!trainee) {
      throw new Error('Trainee not found');
    }

    return trainee.interactions || [];
  }

  async addInteraction(traineeID: string, interaction: InteractionWithReporterID): Promise<InteractionWithReporter> {
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID },
      { $push: { interactions: interaction } },
      { new: true }
    ).populate('interactions.reporterID', 'name imageUrl');

    if (!updatedTrainee) {
      throw new Error('Trainee not found');
    }

    return updatedTrainee.interactions.at(-1) as InteractionWithReporter;
  }

  async updateInteraction(traineeID: string, interaction: InteractionWithReporterID): Promise<InteractionWithReporter> {
    const DBInteraction: InteractionWithReporterID & WithMongoID = { _id: interaction.id, ...interaction };
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID, 'interactions._id': interaction.id },
      { $set: { 'interactions.$': DBInteraction } },
      { new: true }
    ).populate('interactions.reporterID', 'name imageUrl');

    if (!updatedTrainee) {
      throw new Error('Interaction was not found');
    }

    return updatedTrainee.interactions.find(
      (interaction) => interaction.id === DBInteraction._id
    ) as InteractionWithReporter;
  }

  async deleteInteraction(traineeID: string, interactionID: string): Promise<void> {
    await this.TraineeModel.findOneAndUpdate({ _id: traineeID }, { $pull: { interactions: { _id: interactionID } } });
  }

  async getTests(traineeID: string): Promise<Test[]> {
    const trainee = await this.TraineeModel.findById(traineeID).select('educationInfo.tests').exec();

    if (!trainee) {
      throw new Error('Trainee not found');
    }

    return trainee.educationInfo.tests || [];
  }

  async addTest(traineeID: string, test: Test): Promise<Test> {
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID },
      { $push: { 'educationInfo.tests': test } },
      { new: true }
    );

    if (!updatedTrainee) {
      throw new Error('Trainee not found');
    }

    return updatedTrainee.educationInfo.tests.at(-1) as Test;
  }

  async updateTest(traineeID: string, test: Test): Promise<Test> {
    const DBTest: Test & WithMongoID = { _id: test.id, ...test };
    const updatedTrainee = await this.TraineeModel.findOneAndUpdate(
      { _id: traineeID, 'educationInfo.tests._id': test.id },
      { $set: { 'educationInfo.tests.$': DBTest } },
      { new: true }
    );

    if (!updatedTrainee) {
      throw new Error('Trainee not found');
    }

    const updatedTest = updatedTrainee.educationInfo.tests.find((test) => test.id === DBTest._id);
    if (!updatedTest) {
      throw new Error('Test not found');
    }

    return updatedTest;
  }

  async deleteTest(traineeID: string, testID: string): Promise<void> {
    await this.TraineeModel.findOneAndUpdate({ _id: traineeID }, { $pull: { 'educationInfo.tests': { _id: testID } } });
  }
}
