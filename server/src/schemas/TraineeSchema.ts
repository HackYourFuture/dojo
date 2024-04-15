import { Schema } from "mongoose";
import {
  Trainee,
  TraineeContactInfo,
  TraineePersonalInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  Strike,
  Assignment,
  Test,
  TraineeEmploymentHistory,
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
  TestType
} from "../models/Trainee";
import { genId } from "../utils/random";

const TraineePersonalInfoSchema = new Schema<TraineePersonalInfo>(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    preferredName: { type: String, required: false, index: true, default: null },
    gender: { type: String, required: true, enum: Object.values(Gender) },
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
    comments: { type: String, required: false, default: null},
  },
  { _id: false }
);

const TraineeContactInfoSchema = new Schema<TraineeContactInfo>(
  {
    slack: { type: String, required: false, default: null},
    email: { type: String, required: true, index: true, unique: true, match: /@/},
    phone: { type: String, required: false, default: null },
    githubHandle: { type: String, required: false, index: true, default: null },
    linkedin: { type: String, required: false, default: null },
  },
  { _id: false }
);

const StrikeSchema = new Schema<Strike>(
  {
    _id: { type: String, default: genId },
    date: { type: Date, required: true },
    reporterID: { type: String, required: true, ref: 'User' },
    reason: { type: String, enum: Object.values(StrikeReason), required: true },
    comments: { type: String, required: true },
  },
);

const AssignmentSchema = new Schema<Assignment>(
  {
    _id: { type: String, default: genId },
    createDate: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    content: { type: String, required: false },
    comments: { type: String, required: false },
  },
);

const TestSchema = new Schema<Test>(
  {
    _id: { type: String, default: genId },
    date: { type: Date, required: true },
    type: { type: String, required: true, enum: Object.values(TestType) },
    grade: { type: Number, required: true },
    result: { type: String, required: true, enum: Object.values(TestResult)},
    comments: { type: String, required: false, default: null},
  },
);

const TraineeEducationInfoSchema = new Schema<TraineeEducationInfo>(
  {
    startCohort: { type: Number, required: true, min: 0, max: 999},
    currentCohort: { type: Number, required: false, default: null, min: 0, max: 999},
    learningStatus: { type: String, required: true, enum: Object.values(LearningStatus), default: LearningStatus.Studying },
    startDate: { type: Date, required: false, default: null},
    graduationDate: { type: Date, required: false, default: null },
    quitReason: { type: String, required: false, enum: Object.values(QuitReason), default: null },
    strikes: [StrikeSchema],
    assignments: [AssignmentSchema],
    tests: [TestSchema],
    comments: { type: String, required: false, default: null},
  },
  { _id: false, minimize: false }
);

const TraineeEmploymentHistorySchema = new Schema<TraineeEmploymentHistory>(
  {
    _id: { type: String, default: genId },
    type: { type: String, required: true, enum: Object.values(EmploymentType) },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false, default: null },
    feeCollected: { type: Boolean, required: false , default: null},
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
    preferredLocation: { type: String, required: false, default: null },
    extraTechnologies: { type: String, required: false, default: null },
    employmentHistory: {
      type: [TraineeEmploymentHistorySchema],
      required: true,
    },
    comments: { type: String, required: false, default: null },
  },
  { _id: false, minimize: false }
);

const TraineeSchema = new Schema<Trainee>(
  {
    _id: { type: String, default: genId },
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
  },
  { timestamps: true, minimize: false },
);

TraineeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  minimize: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export default TraineeSchema;
