import { CreateTraineeRequestData } from '../api/types';
import { FormState } from '../components/NewTraineeForm';
import { Trainee } from '../../../../data/types/Trainee';
import { createTrainee } from '../api/api';
import { useMutation } from '@tanstack/react-query';

const mapFormStateToRequestData = (formState: FormState): CreateTraineeRequestData => {
  return {
    personalInfo: {
      firstName: formState.firstName,
      lastName: formState.lastName,
      gender: formState.gender!,
    },
    contactInfo: {
      email: formState.email,
    },
    educationInfo: {
      startCohort: Number(formState.cohort),
      currentCohort: Number(formState.cohort),
      learningStatus: formState.learningStatus,
    },
    employmentInfo: {
      jobPath: formState.jobPath,
    },
  };
};

export const useCreateTraineeProfile = (options?: {
  onSuccess?: (id: string) => void;
  onError?: (err: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async (form: FormState) => createTrainee(mapFormStateToRequestData(form)),
    onError: (error) => {
      console.error('Error creating trainee profile:', error);
      options?.onError?.(error);
    },
    onSuccess: (data: Trainee) => options?.onSuccess?.(data.profilePath),
  });
};
