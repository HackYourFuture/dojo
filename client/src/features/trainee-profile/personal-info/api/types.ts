import {
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../../../../data/types/Trainee';

export interface SaveTraineeRequestData {
  personalInfo?: Partial<TraineePersonalInfo>;
  contactInfo?: Partial<TraineeContactInfo>;
  educationInfo?: Partial<TraineeEducationInfo>;
  employmentInfo?: Partial<TraineeEmploymentInfo>;
}
