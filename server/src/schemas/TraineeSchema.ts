import { Schema, Types } from "mongoose";
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
} from "../models/Trainee";

const TraineePersonalInfoSchema = new Schema<TraineePersonalInfo>(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    gender: { type: String, required: true, enum: Object.values(Gender) },
    pronouns: { type: String, required: false },
    location: { type: String, required: false },
    englishLevel: {
      type: String,
      required: false,
      enum: Object.values(EnglishLevel),
    },
    professionalDutch: { type: Boolean, required: false },
    imageUrl: { type: String, required: false },
    countryOfOrigin: { type: String, required: false },
    background: {
      type: String,
      required: false,
      enum: Object.values(Background),
    },
    hasWorkPermit: { type: Boolean, required: false },
    receivesUitkering: { type: Boolean, required: false },
    caseManagerPressing: { type: Boolean, required: false },
    educationLevel: {
      type: String,
      required: false,
      enum: Object.values(EducationLevel),
    },
    educationBackground: { type: String, required: false },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TraineeContactInfoSchema = new Schema<TraineeContactInfo>(
  {
    slack: { type: String, required: false },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: false },
    github: { type: String, required: false, index: true },
    linkedin: { type: String, required: false },
  },
  { _id: false }
);

const StrikeSchema = new Schema<Strike>(
  {
    createDate: { type: Date, required: true },
    strikeDate: { type: Date, required: true },
    reporterID: { type: String, required: true },
    reason: { type: String, enum: Object.values(StrikeReason), required: true },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<Assignment>(
  {
    createDate: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    content: { type: String, required: false },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TestSchema = new Schema<Test>(
  {
    testDate: { type: Date, required: true },
    type: { type: String, required: true },
    grade: { type: Number, required: true },
    pass: { type: Boolean, required: true },
    warning: { type: Boolean, required: true },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TraineeEducationInfoSchema = new Schema<TraineeEducationInfo>(
  {
    startCohort: { type: Number, required: false },
    currentCohort: { type: Number, required: false },
    learningStatus: { type: String, required: true, default: "active" },
    startDate: { type: Date, required: false },
    graduationDate: { type: Date, required: false },
    quitReason: { type: String, required: false },
    strikes: [StrikeSchema],
    assignments: [AssignmentSchema],
    tests: [TestSchema],
    comments: { type: String, required: false },
  },
  { _id: false, minimize: false }
);

const TraineeEmploymentHistorySchema = new Schema<TraineeEmploymentHistory>(
  {
    type: { type: String, required: true, enum: Object.values(EmploymentType) },
    companyName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    role: { type: String, required: true },
    feeCollected: { type: Boolean, required: false },
    feeAmount: { type: Number, required: false },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TraineeEmploymentInfoSchema = new Schema<TraineeEmploymentInfo>(
  {
    status: { type: String, required: false },
    cvURL: { type: String, required: false },
    availability: { type: String, required: false },
    preferredRole: { type: String, required: false },
    employmentHistory: {
      type: [TraineeEmploymentHistorySchema],
      required: true,
    },
    comments: { type: String, required: false },
  },
  { _id: false, minimize: false }
);

const TraineeSchema = new Schema<Trainee>(
  {
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
  { timestamps: true }
);

TraineeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export default TraineeSchema;
