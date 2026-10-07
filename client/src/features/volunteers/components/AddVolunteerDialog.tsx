import { ChangeEvent, useState } from 'react';
import { Gender, genderOptions } from '../../../data/types/Person';
import { SelectChangeEvent, Stack, TextField } from '@mui/material';
import { emailValidationError, nameValidationError } from '../../../data/text';

import { DropdownSelect } from '../../../components/DropdownSelect';
import { FormDialog } from '../../../components/FormDialog';
import { NewVolunteer } from '../Volunteer';
import { useCreateVolunteer } from '../data/mutations';
import { useNavigate } from 'react-router';

interface AddVolunteerDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

type FormErrors = Partial<Record<'firstName' | 'lastName' | 'email', string>>;

const INITIAL_STATE: NewVolunteer = {
  firstName: '',
  lastName: '',
  gender: null,
  email: '',
};

// The errors of the fields that fail, or null when the form can be sent.
const getFormErrors = (formState: NewVolunteer): FormErrors | null => {
  const errors: FormErrors = {};
  const firstNameError = nameValidationError(formState.firstName);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }
  const lastNameError = nameValidationError(formState.lastName);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }
  const emailError = emailValidationError(formState.email);
  if (emailError) {
    errors.email = emailError;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

/** The dialog to add a volunteer, which opens the profile of the new volunteer. */
export const AddVolunteerDialog = ({ isOpen, handleClose }: AddVolunteerDialogProps) => {
  const navigate = useNavigate();
  const { mutate: createVolunteer, isPending, error: submitError, reset } = useCreateVolunteer();

  const [formState, setFormState] = useState<NewVolunteer>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});

  // Also forgets the error of the last attempt, so it is not shown the next time the dialog opens.
  const onClose = () => {
    setFormState(INITIAL_STATE);
    setErrors({});
    reset();
    handleClose();
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGenderChange = (event: SelectChangeEvent<string>) => {
    // The empty option clears the gender.
    const gender = event.target.value ? (event.target.value as Gender) : null;
    setFormState((prevState) => ({ ...prevState, gender }));
  };

  const handleSubmit = () => {
    const formErrors = getFormErrors(formState);
    if (formErrors) {
      setErrors(formErrors);
      return;
    }

    createVolunteer(formState, {
      onSuccess: (volunteer) => {
        onClose();
        navigate(volunteer.profilePath);
      },
    });
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="New volunteer"
      submitLabel="Create"
      isSaving={isPending}
      error={submitError && `An error occurred while creating the volunteer: ${submitError.message || 'unknown'}`}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {/* Aligned to the top, so one name's error message does not stretch the other. */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <TextField
          required
          disabled={isPending}
          id="firstName"
          name="firstName"
          label="First name"
          value={formState.firstName}
          onChange={handleTextChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: 1 }}
        />
        <TextField
          required
          disabled={isPending}
          id="lastName"
          name="lastName"
          label="Last name"
          value={formState.lastName}
          onChange={handleTextChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      {/* Aligned to the top, so the email's error message does not stretch the gender. */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <DropdownSelect
          id="gender"
          name="gender"
          label="Gender"
          options={genderOptions}
          nullable
          disabled={isPending}
          value={formState.gender ?? undefined}
          onChange={handleGenderChange}
        />
        <TextField
          required
          disabled={isPending}
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="jane.roe@example.com"
          value={formState.email}
          onChange={handleTextChange}
          error={!!errors.email}
          helperText={errors.email}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: 1 }}
        />
      </Stack>
    </FormDialog>
  );
};
