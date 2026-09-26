import { CreateTraineeRequest, TraineeResponse, UpdateTraineeRequest } from './types';
import { NewTrainee, Track, Trainee, TraineeChanges } from '../../../data/types/Trainee';

export const mapTraineeToDomain = (trainee: TraineeResponse): Trainee => {
  return {
    id: trainee.id,
    displayName: trainee.displayName,
    profilePath: trainee.profilePath,
    pictureUrl: trainee.pictureUrl,
    thumbnailUrl: trainee.thumbnailUrl,
    personalInfo: {
      firstName: trainee.firstName,
      lastName: trainee.lastName,
      preferredName: trainee.preferredName,
      gender: trainee.gender,
      pronouns: trainee.pronouns,
      location: trainee.location,
      englishLevel: trainee.englishLevel,
      professionalDutch: trainee.professionalDutch,
      countryOfOrigin: trainee.countryOfOrigin,
      background: trainee.background,
      educationLevel: trainee.educationLevel,
      educationBackground: trainee.educationBackground,
      comments: trainee.comments,
    },
    contactInfo: {
      email: trainee.email,
      slackId: trainee.slackId,
      phone: trainee.phone,
      githubHandle: trainee.githubHandle,
      linkedinUrl: trainee.linkedinUrl,
      emergencyContactName: trainee.emergencyContactName,
      emergencyContactPhone: trainee.emergencyContactPhone,
    },
    educationInfo: {
      startCohort: trainee.startCohort,
      currentCohort: trainee.currentCohort,
      learningStatus: trainee.learningStatus,
      track: trainee.track,
      mentorTech: trainee.mentorTech,
      mentorHr: trainee.mentorHr,
      mentorEnglish: trainee.mentorEnglish,
      startDate: trainee.startDate,
      graduationDate: trainee.graduationDate,
      quitReason: trainee.quitReason,
      quitDate: trainee.quitDate,
    },
    employmentInfo: {
      jobPath: trainee.jobPath,
    },
  };
};

export const mapDomainToUpdateTraineeRequest = (changes: TraineeChanges): UpdateTraineeRequest => {
  const request: UpdateTraineeRequest = {
    ...changes.personalInfo,
    ...changes.contactInfo,
    ...changes.educationInfo,
    ...changes.employmentInfo,
  };

  // The API rejects empty text for most fields, so a cleared field is sent as null.
  for (const field of Object.keys(request) as (keyof UpdateTraineeRequest)[]) {
    const value = request[field];
    if (typeof value === 'string' && value.trim() === '') {
      request[field] = null;
    }
  }
  return request;
};

export const mapDomainToCreateTraineeRequest = (newTrainee: NewTrainee): CreateTraineeRequest => {
  return {
    firstName: newTrainee.firstName,
    lastName: newTrainee.lastName,
    gender: newTrainee.gender,
    email: newTrainee.email,
    // The cohort input holds text.
    startCohort: Number(newTrainee.cohort),
    currentCohort: Number(newTrainee.cohort),
    learningStatus: newTrainee.learningStatus,
    jobPath: newTrainee.jobPath,
    // The form does not ask for a track: every trainee starts in the core program.
    track: Track.CoreProgram,
  };
};
