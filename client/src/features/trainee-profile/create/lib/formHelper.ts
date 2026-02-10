import { FormErrors, FormState } from '../hooks/useCreateTraineeForm';

const FIELD_REQUIRED_ERROR = 'This field is required';

const validateName = (name: string) => {
  if (!name) return FIELD_REQUIRED_ERROR;
  if (name.length < 2) return 'Name must be at least 2 characters';
  return null;
};

const validateEmail = (email: string) => {
  if (!email) return FIELD_REQUIRED_ERROR;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email must be of format name@domain.com';
  return null;
};

const validateCohort = (cohort: number | undefined) => {
  if (cohort === undefined) return FIELD_REQUIRED_ERROR;
  if (cohort < 0) return 'Cohort must be a positive number';
  return null;
};

export const validateForm = (formState: FormState): FormErrors => {
  const errors: FormErrors = {
    firstName: validateName(formState.firstName),
    lastName: validateName(formState.lastName),
    gender: formState.gender ? null : FIELD_REQUIRED_ERROR,
    email: validateEmail(formState.email),
    cohort: validateCohort(formState.cohort),
  };

  return errors;
};
