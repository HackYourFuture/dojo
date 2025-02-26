import { Schema } from 'mongoose';
import {
  Trainee,
  TraineeContactInfo,
  TraineePersonalInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  StrikeWithReporterID,
  Assignment,
  Test,
  EmploymentHistory,
  Gender,
  EnglishLevel,
  Background,
  EducationLevel,
  EmploymentType,
  StrikeReason,
  JobPath,
  LearningStatus,
  QuitReason,
  ResidencyStatus,
  TestResult,
  TestType,
  InteractionWithReporterID,
  InteractionType,
} from '../models';
import { genId } from '../utils/random';
import { WithMongoID, jsonFormatting } from '../utils/database';

const TraineePersonalInfoSchema = new Schema<TraineePersonalInfo>(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    preferredName: { type: String, required: false, index: true, default: null },
    gender: { type: String, required: false, enum: Object.values(Gender), default: null },
    pronouns: { type: String, required: false, default: null },
    location: { type: String, required: false, default: null },
    englishLevel: { type: String, required: false, enum: Object.values(EnglishLevel), default: null },
    professionalDutch: { type: Boolean, required: false, default: null },
    countryOfOrigin: { type: String, required: false, default: null },
    background: { type: String, required: false, enum: Object.values(Background), default: null },
    hasWorkPermit: { type: Boolean, required: false, default: null },
    residencyStatus: { type: String, required: false, enum: Object.values(ResidencyStatus), default: null },
    receivesSocialBenefits: { type: Boolean, required: false, default: null },
    caseManagerUrging: { type: Boolean, required: false, default: null },
    educationLevel: { type: String, required: false, enum: Object.values(EducationLevel), default: null },
    educationBackground: { type: String, required: false, default: null },
    comments: { type: String, required: false, default: null },
  },
  { _id: false }
);

const TraineeContactInfoSchema = new Schema<TraineeContactInfo>(
  {
    slackId: { type: String, required: false, default: null, match: /^U[A-Z0-9]{8,10}$/ },
    email: { type: String, required: true, index: true, unique: true, match: /@/ },
    phone: { type: String, required: false, default: null },
    githubHandle: { type: String, required: false, index: true, default: null },
    linkedin: { type: String, required: false, default: null },
  },
  { _id: false }
);

const StrikeSchema = new Schema<StrikeWithReporterID & WithMongoID>({
  _id: { type: String, default: genId },
  date: { type: Date, required: true },
  reporterID: { type: String, required: true, ref: 'Users', alias: 'reporter' },
  reason: { type: String, enum: Object.values(StrikeReason), required: true },
  comments: { type: String, required: true },
});

const InteractionSchema = new Schema<InteractionWithReporterID & WithMongoID>({
  _id: { type: String, default: genId },
  date: { type: Date, required: true },
  reporterID: { type: String, required: true, ref: 'Users', alias: 'reporter' },
  type: { type: String, enum: Object.values(InteractionType), required: true },
  title: { type: String, required: false },
  details: { type: String, required: true },
});

const AssignmentSchema = new Schema<Assignment & WithMongoID>({
  _id: { type: String, default: genId },
  createDate: { type: Date, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  content: { type: String, required: false },
  comments: { type: String, required: false },
});

const TestSchema = new Schema<Test & WithMongoID>({
  _id: { type: String, default: genId },
  date: { type: Date, required: true },
  type: { type: String, required: true, enum: Object.values(TestType) },
  score: { type: Number, required: false, default: null },
  result: { type: String, required: true, enum: Object.values(TestResult) },
  comments: { type: String, required: false, default: null },
});

const TraineeEducationInfoSchema = new Schema<TraineeEducationInfo>(
  {
    startCohort: { type: Number, required: true, min: 0, max: 999 },
    currentCohort: { type: Number, required: false, default: null, min: 0, max: 999 },
    learningStatus: {
      type: String,
      required: true,
      enum: Object.values(LearningStatus),
      default: LearningStatus.Studying,
    },
    startDate: { type: Date, required: false, default: null },
    graduationDate: { type: Date, required: false, default: null },
    quitReason: { type: String, required: false, enum: Object.values(QuitReason), default: null },
    quitDate: { type: Date, required: false, default: null },
    strikes: [StrikeSchema],
    assignments: [AssignmentSchema],
    tests: [TestSchema],
    comments: { type: String, required: false, default: null },
  },
  { _id: false, minimize: false }
);

const EmploymentHistorySchema = new Schema<EmploymentHistory & WithMongoID>(
  {
    _id: { type: String, default: genId },
    type: { type: String, required: true, enum: Object.values(EmploymentType) },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false, default: null },
    feeCollected: { type: Boolean, required: false, default: null },
    feeAmount: { type: Number, required: false, default: null },
    comments: { type: String, required: false, default: null },
  },
  { minimize: false }
);

const TraineeEmploymentInfoSchema = new Schema<TraineeEmploymentInfo>(
  {
    jobPath: { type: String, required: true, enum: Object.values(JobPath), default: JobPath.NotGraduated },
    cvURL: { type: String, required: false, default: null },
    availability: { type: String, required: false, default: null },
    preferredRole: { type: String, required: false, default: null },
    drivingLicense: { type: Boolean, required: false, default: null },
    preferredLocation: { type: String, required: false, default: null },
    extraTechnologies: { type: String, required: false, default: null },
    employmentHistory: {
      type: [EmploymentHistorySchema],
      required: true,
    },
    comments: { type: String, required: false, default: null },
  },
  { _id: false, minimize: false }
);

const TraineeSchema = new Schema<Trainee & WithMongoID>(
  {
    _id: { type: String, default: genId },
    imageURL: { type: String, required: false, default: null },
    thumbnailURL: { type: String, required: false, default: null },
    personalInfo: { type: TraineePersonalInfoSchema, required: true },
    contactInfo: { type: TraineeContactInfoSchema, required: true },
    educationInfo: {
      type: TraineeEducationInfoSchema,
      required: true,
      default: {},
    },
    employmentInfo: {
      type: TraineeEmploymentInfoSchema,
      required: true,
      default: {},
    },
    interactions: [InteractionSchema],
  },
  { timestamps: true, minimize: false }
);

TraineeSchema.virtual('displayName').get(function () {
  const { preferredName, firstName, lastName } = this.personalInfo;
  const name: string = preferredName ? preferredName : firstName;
  return `${name} ${lastName}`;
});

TraineeSchema.set('toJSON', jsonFormatting);
StrikeSchema.set('toJSON', jsonFormatting);
InteractionSchema.set('toJSON', jsonFormatting);
TestSchema.set('toJSON', jsonFormatting);

export { TraineeSchema };
