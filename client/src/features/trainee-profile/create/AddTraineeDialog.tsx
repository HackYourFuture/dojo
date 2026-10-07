import { ChangeEvent, useState } from 'react';
import { FIELD_REQUIRED_ERROR, emailValidationError, nameValidationError } from '../../../data/text';
import { JobPath, LearningStatus, NewTrainee } from '../../../data/types/Trainee';
import { SelectChangeEvent, Stack, TextField } from '@mui/material';
import { jobPathOptions, learningStatusOptions } from '../utils/selectOptions';

import { DropdownSelect } from '../../../components/DropdownSelect';
import { FormDialog } from '../../../components/FormDialog';
import { genderOptions } from '../../../data/types/Person';
import { useCreateTrainee } from '../data/mutations';
import { useNavigate } from 'react-router';

interface AddTraineeDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

type FormErrors = Partial<Record<'firstName' | 'lastName' | 'gender' | 'email' | 'cohort', string>>;

const INITIAL_STATE: NewTrainee = {
  firstName: '',
  lastName: '',
  gender: null,
  email: '',
  cohort: 0,
  learningStatus: LearningStatus.Studying,
  jobPath: JobPath.NotGraduated,
};

const cohortValidationError = (cohort: number | undefined) => {
  // The number input gives '' when it is emptied.
  if (cohort === undefined || String(cohort) === '') {
    return FIELD_REQUIRED_ERROR;
  }
  if (cohort < 0) {
    return 'Cohort must be a positive number';
  }
  return null;
};

// The errors of the fields that fail, or null when the form can be sent.
const getFormErrors = (formState: NewTrainee): FormErrors | null => {
  const errors: FormErrors = {};
  const firstNameError = nameValidationError(formState.firstName);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }
  const lastNameError = nameValidationError(formState.lastName);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }
  if (!formState.gender) {
    errors.gender = FIELD_REQUIRED_ERROR;
  }
  const emailError = emailValidationError(formState.email);
  if (emailError) {
    errors.email = emailError;
  }
  const cohortError = cohortValidationError(formState.cohort);
  if (cohortError) {
    errors.cohort = cohortError;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

/** The dialog to add a trainee, which opens the profile of the new trainee. */
export const AddTraineeDialog = ({ isOpen, handleClose }: AddTraineeDialogProps) => {
  const navigate = useNavigate();
  const { mutate: createTrainee, isPending, error: submitError, reset } = useCreateTrainee();

  const [formState, setFormState] = useState<NewTrainee>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors | null>(null);

  // Also forgets the error of the last attempt, so it is not shown the next time the dialog opens.
  const onClose = () => {
    setFormState(INITIAL_STATE);
    setErrors(null);
    reset();
    handleClose();
  };

  // The text fields and the dropdowns both report the name of the field and its new value.
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = event.target;
    // The number input ignores maxLength, so the cohort is limited to three digits here.
    if (name === 'cohort' && String(value).length > 3) {
      return;
    }
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    const formErrors = getFormErrors(formState);
    if (formErrors) {
      setErrors(formErrors);
      return;
    }

    createTrainee(formState, {
      onSuccess: (trainee) => {
        onClose();
        navigate(trainee.profilePath);
      },
    });
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="New trainee profile"
      submitLabel="Create"
      isSaving={isPending}
      error={submitError && `An error occurred while creating the trainee profile: ${submitError.message || 'unknown'}`}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <TextField
        disabled={isPending}
        id="firstName"
        name="firstName"
        error={!!errors?.firstName}
        helperText={errors?.firstName}
        label="First name"
        slotProps={{ htmlInput: { maxLength: 100 } }}
        value={formState.firstName}
        onChange={handleChange}
      />
      <TextField
        disabled={isPending}
        id="lastName"
        name="lastName"
        error={!!errors?.lastName}
        helperText={errors?.lastName}
        label="Last name"
        slotProps={{ htmlInput: { maxLength: 100 } }}
        value={formState.lastName}
        onChange={handleChange}
      />
      <DropdownSelect
        id="gender"
        name="gender"
        label="Gender"
        options={genderOptions}
        disabled={isPending}
        value={formState.gender || undefined}
        error={errors?.gender || ''}
        onChange={handleChange}
      />
      <TextField
        disabled={isPending}
        id="email"
        name="email"
        error={!!errors?.email}
        helperText={errors?.email}
        label="Email"
        slotProps={{ htmlInput: { maxLength: 100 } }}
        value={formState.email}
        onChange={handleChange}
      />
      <Stack direction="row" spacing={2}>
        <TextField
          disabled={isPending}
          id="cohort"
          name="cohort"
          type="number"
          error={!!errors?.cohort}
          helperText={errors?.cohort}
          label="Start cohort"
          value={formState.cohort}
          onChange={handleChange}
        />
        <DropdownSelect
          id="learningStatus"
          name="learningStatus"
          label="Learning Status"
          options={learningStatusOptions}
          disabled={isPending}
          value={formState.learningStatus}
          onChange={handleChange}
        />
        <DropdownSelect
          id="jobPath"
          name="jobPath"
          label="Job path"
          options={jobPathOptions}
          disabled={isPending}
          value={formState.jobPath}
          onChange={handleChange}
        />
      </Stack>
    </FormDialog>
  );
};
