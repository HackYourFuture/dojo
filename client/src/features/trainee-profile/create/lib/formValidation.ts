import { FormErrors, FormState } from '../components/NewTraineeForm';

const FIELD_REQUIRED_ERROR = 'This field is required';

const nameValidationError = (name: string): string | null => {
  if (!name) return FIELD_REQUIRED_ERROR;
  if (name.length < 2) return 'Name must be at least 2 characters';
  return null;
};

const emailValidationError = (email: string) => {
  if (!email) return FIELD_REQUIRED_ERROR;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email must be of format name@domain.com';
  return null;
};

const cohortValidationError = (cohort: number | undefined) => {
  if (cohort === undefined) return FIELD_REQUIRED_ERROR;
  if (cohort < 0) return 'Cohort must be a positive number';
  return null;
};

/**
 * Validates fields of the form and returns an object with error messages for each field that fails validation. If there are no errors, returns null.
 * @param formState
 * @returns
 */
export const validateAndCollectFormErrors = (formState: FormState): FormErrors | null => {
  const errors: FormErrors = {};
  const nameError = nameValidationError(formState.firstName);
  if (nameError) errors.firstName = nameError;

  const lastNameError = nameValidationError(formState.lastName);
  const emailError = emailValidationError(formState.email);
  const cohortError = cohortValidationError(formState.cohort);
  if (lastNameError) errors.lastName = lastNameError;
  if (emailError) errors.email = emailError;
  if (cohortError) errors.cohort = cohortError;
  if (!formState.gender) errors.gender = FIELD_REQUIRED_ERROR;

  return Object.keys(errors).length > 0 ? errors : null;
};
