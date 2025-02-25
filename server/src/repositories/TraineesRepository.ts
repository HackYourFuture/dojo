import mongoose from 'mongoose';
import { Trainee, StrikeWithReporter, StrikeWithReporterID, StrikeReason, Test, TestResult, TestType } from '../models';
import { TraineeSchema } from '../schemas';
import { WithMongoID } from '../utils/database';
import { UserRepository } from './UserRepository';
import { InteractionType, InteractionWithReporter, InteractionWithReporterID } from '../models/Interaction';

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
  validateTrainee(trainee: Trainee): Promise<void>;

  getStrikes(traineeID: string): Promise<StrikeWithReporter[]>;
  addStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  updateStrike(traineeID: string, strike: StrikeWithReporterID): Promise<StrikeWithReporter>;
  deleteStrike(traineeID: string, strikeID: string): Promise<void>;
  validateStrike(strike: StrikeWithReporterID): Promise<void>;

  getInteractions(traineeID: string): Promise<InteractionWithReporter[]>;
  addInteraction(traineeID: string, interaction: InteractionWithReporterID): Promise<InteractionWithReporter>;
  updateInteraction(traineeID: string, interaction: InteractionWithReporterID): Promise<InteractionWithReporter>;
  deleteInteraction(traineeID: string, interactionID: string): Promise<void>;
  validateInteraction(interaction: InteractionWithReporterID): Promise<void>;

  getTests(traineeID: string): Promise<Test[]>;
  addTest(traineeID: string, test: Test): Promise<Test>;
  updateTest(traineeID: string, test: Test): Promise<Test>;
  deleteTest(traineeID: string, testID: string): Promise<void>;
  validateTest(test: Test): Promise<void>;
}

export class MongooseTraineesRepository implements TraineesRepository {
  private readonly TraineeModel: mongoose.Model<Trainee & WithMongoID>;
  private readonly userRepository: UserRepository;

  constructor(db: mongoose.Connection, userRepository: UserRepository) {
    this.TraineeModel = db.model<Trainee & WithMongoID>('Trainee', TraineeSchema);
    this.userRepository = userRepository;
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
      .where('educationInfo.learningStatus')
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

  async validateTrainee(trainee: Trainee): Promise<void> {
    await this.TraineeModel.validate(trainee);
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

  async validateStrike(strike: StrikeWithReporterID): Promise<void> {
    if (!strike.date) {
      throw new Error('Strike date is required');
    }
    if (!strike.reporterID) {
      throw new Error('Strike reporter ID is required');
    }
    if (!strike.reason) {
      throw new Error('Strike reason is required');
    }
    if (!Object.values(StrikeReason).includes(strike.reason)) {
      throw new Error('Unknown strike reason');
    }
    if (!strike.comments) {
      throw new Error('Strike comments are required');
    }
    if ((await this.userRepository.findUserByID(strike.reporterID)) === null) {
      throw new Error('Invalid strike reporter ID');
    }
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

  async validateInteraction(interaction: InteractionWithReporterID): Promise<void> {
    if (!interaction.date) {
      throw new Error('Interaction date is required');
    }
    if (!interaction.reporterID) {
      throw new Error('Interaction reporter ID is required');
    }
    if (!interaction.details) {
      throw new Error('Interaction details are required');
    }
    if (!Object.values(InteractionType).includes(interaction.type)) {
      throw new Error(`Unknown interaction type [${Object.values(InteractionType)}]`);
    }
    if ((await this.userRepository.findUserByID(interaction.reporterID)) === null) {
      throw new Error('Unknown reporter ID');
    }
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

  async validateTest(test: Test): Promise<void> {
    if (!test.date) {
      throw new Error('Test date is required');
    }
    if (!test.result || !Object.values(TestResult).includes(test.result)) {
      throw new Error(`Unknown test result [${Object.values(TestResult)}]`);
    }
    if (!test.type || !Object.values(TestType).includes(test.type)) {
      throw new Error(`Unknown test type [${Object.values(TestType)}]`);
    }
  }
}
