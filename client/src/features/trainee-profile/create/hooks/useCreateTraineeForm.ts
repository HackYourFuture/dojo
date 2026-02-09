import { Gender, JobPath, LearningStatus } from '../../../../data/types/Trainee';

import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

type FormState = {
  firstName: string;
  lastName: string;
  gender: Gender | null;
  email: string;
  startCohort?: number;
  learningStatus: LearningStatus;
  jobPath: JobPath;
};

type FormErrors = {
  [K in keyof FormState]?: string;
};
export const useCreateTraineeForm = () => {
  // fixme: rename the formState to something more specific like createTraineeFormState
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    gender: null,
    email: '',
    startCohort: undefined,
    learningStatus: LearningStatus.Studying,
    jobPath: JobPath.NotGraduated,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formState.firstName) newErrors.firstName = 'First name is required';
    if (!formState.lastName) newErrors.lastName = 'Last name is required';
    if (!formState.email) newErrors.email = 'Email is required';
    if (!formState.gender) newErrors.gender = 'Gender is required';
    if (!formState.startCohort) newErrors.startCohort = 'Start cohort is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSelectGender = (event: SelectChangeEvent) => {
    const genderValue = event.target.value as Gender;
    setFormState((prevState) => ({
      ...prevState,
      gender: genderValue,
    }));
  };
  const handleSubmit = (event: React.SubmitEventHandler<HTMLFormElement>) => {
    // event.preventDefault();

    setErrors({});
    const errors = validate();
    console.log(errors);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Handle validation errors, e.g., set error state or display messages
      console.log('Validation errors:', errors);
      return;
    }
    console.log(' no errors, submit, yay');
  };
  return {
    formState,
    onSelectGender,
    handleChange,
    setFormState,
    handleSubmit,
    errors,
  };
};
