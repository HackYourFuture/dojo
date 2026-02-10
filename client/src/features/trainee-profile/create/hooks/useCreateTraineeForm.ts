import { Gender, JobPath, LearningStatus } from '../../../../data/types/Trainee';
import { SubmitEventHandler, useState } from 'react';

import { SelectChangeEvent } from '@mui/material';
import { useCreateTraineeProfile } from '../data/mutations';
import { validateForm } from '../lib/formHelper';

export type FormState = {
  firstName: string;
  lastName: string;
  gender: Gender | null;
  email: string;
  cohort: number;
  learningStatus: LearningStatus;
  jobPath: JobPath;
};

export type FormErrors = {
  [K in keyof FormState]?: string | null;
};
export const useCreateTraineeForm = () => {
  const { mutate: createTrainee, isPending, data } = useCreateTraineeProfile();
  // fixme: rename the formState to something more specific like createTraineeFormState
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    gender: null,
    email: '',
    cohort: 0,
    learningStatus: LearningStatus.Studying,
    jobPath: JobPath.NotGraduated,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelect = (event: SelectChangeEvent<String | number>) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // TODO: move this to the component
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrors({});
    const errors = validateForm(formState);
    setErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error != null);

    if (hasErrors) {
      console.log('form has errors, not submitting', errors);
      return;
    }

    createTrainee(formState);
    // TODO: Navigate to the profile of the new trainee
    //TODO: handle modal opening and closing
    // TODO: where to put the button??
    // TODO: test updating existing profile
  };
  return {
    formState,
    onSelectGender: handleSelect,
    handleChange,
    handleSelect,
    setFormState,
    handleSubmit,
    errors,
    isPending,
  };
};
