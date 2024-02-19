import mongoose from "mongoose";
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
} from "../models/Trainee";

const TraineePersonalInfoSchema = new mongoose.Schema<TraineePersonalInfo>(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    gender: { type: String, required: false },
    location: { type: String, required: false },
    englishLevel: { type: String, required: false },
    professionalDutch: { type: Boolean, required: false },
    imageUrl: { type: String, required: false },
    countryOfOrigin: { type: String, required: false },
    hasWorkPermit: { type: Boolean, required: false },
    hasUitkering: { type: Boolean, required: false },
    caseManagerPressing: { type: Boolean, required: false },
    educationLevel: { type: String, required: false },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TraineeContactInfoSchema = new mongoose.Schema<TraineeContactInfo>(
  {
    slack: { type: String, required: false },
    email: { type: String, required: false, index: true },
    phone: { type: String, required: false },
    github: { type: String, required: false, index: true },
    linkedin: { type: String, required: false },
  },
  { _id: false }
);

const StrikeSchema = new mongoose.Schema<Strike>(
  {
    createDate: { type: Date, required: true },
    strikeDate: { type: Date, required: true },
    reason: { type: String, required: true },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const AssignmentSchema = new mongoose.Schema<Assignment>(
  {
    createDate: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    content: { type: String, required: false },
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TestSchema = new mongoose.Schema<Test>(
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

const TraineeEducationInfoSchema = new mongoose.Schema<TraineeEducationInfo>(
  {
    startCohort: { type: Number, required: true },
    currentCohort: { type: Number, required: true },
    learningStatus: { type: String, required: true },
    startDate: { type: Date, required: true },
    graduationDate: { type: Date, required: false },
    quitReason: { type: String, required: false },
    strikes: [StrikeSchema],
    assignments: [AssignmentSchema],
    tests: [TestSchema],
    comments: { type: String, required: false },
  },
  { _id: false }
);

const TraineeEmploymentHistorySchema =
  new mongoose.Schema<TraineeEmploymentHistory>(
    {
      type: { type: String, required: true },
      company: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: false },
      role: { type: String, required: true },
      feeCollected: { type: Boolean, required: false },
      feeAmount: { type: Number, required: false },
      comments: { type: String, required: false },
    },
    { _id: false }
  );

const TraineeEmploymentInfoSchema = new mongoose.Schema<TraineeEmploymentInfo>(
  {
    status: { type: String, required: true },
    professionalBackground: { type: String, required: false },
    cvURL: { type: String, required: false },
    availability: { type: String, required: false },
    preferredRole: { type: String, required: false },
    employmentHistory: {
      type: [TraineeEmploymentHistorySchema],
      required: true,
    },
    comments: { type: String, required: false },
  },
  { _id: false }
);

export default new mongoose.Schema<Trainee>({
  id: { type: String, required: true, index: true },
  personalInfo: { type: TraineePersonalInfoSchema, required: true },
  contactInfo: { type: TraineeContactInfoSchema, required: true },
  educationInfo: { type: TraineeEducationInfoSchema, required: true },
  employmentInfo: { type: TraineeEmploymentInfoSchema, required: true },
});
