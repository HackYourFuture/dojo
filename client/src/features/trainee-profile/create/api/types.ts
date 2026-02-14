import {
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../../../../data/types/Trainee';

export type CreateTraineeRequestData = {
  personalInfo: Pick<TraineePersonalInfo, 'firstName' | 'lastName' | 'gender'>;
  contactInfo: Pick<TraineeContactInfo, 'email'>;
  educationInfo: Pick<TraineeEducationInfo, 'startCohort' | 'currentCohort' | 'learningStatus'>;
  employmentInfo: Pick<TraineeEmploymentInfo, 'jobPath'>;
};
