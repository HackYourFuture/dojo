import { Button, SelectChangeEvent, Stack } from '@mui/material';
import { Gender, JobPath, LearningStatus } from '../../../../data/types/Trainee';

import { DropdownSelect } from '../../profile/components/DropdownSelect';
import { GenderSelect } from '../../profile/components/GenderSelect';
import { SubmitEventHandler } from 'react';
import TextFieldWrapper from './TextFieldWrapper';

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

export const NewTraineeForm: React.FC<{
  isLoading: boolean;
  formState: FormState;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSelect: (event: SelectChangeEvent<String | number>) => void;
  handleSubmit: SubmitEventHandler<HTMLFormElement>;
}> = ({ isLoading, formState, errors, handleChange, handleSelect, handleSubmit, handleClose }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextFieldWrapper
          disabled={isLoading}
          id="firstName"
          name="firstName"
          error={!!errors.firstName}
          helperText={errors.firstName}
          label="First name"
          value={formState.firstName}
          onChange={handleChange}
        />
        <TextFieldWrapper
          disabled={isLoading}
          id="lastName"
          name="lastName"
          error={!!errors.lastName}
          helperText={errors.lastName}
          label="Last name"
          value={formState.lastName}
          onChange={handleChange}
        />
        <GenderSelect
          disabled={isLoading}
          isEditing
          value={formState.gender || undefined}
          error={errors.gender || ''}
          onChange={handleSelect}
        />
        <TextFieldWrapper
          disabled={isLoading}
          id="email"
          name="email"
          error={!!errors.email}
          helperText={errors.email}
          label="Email"
          value={formState.email}
          onChange={handleChange}
        />
        <TextFieldWrapper
          disabled={isLoading}
          id="cohort"
          name="cohort"
          type="number"
          error={!!errors.cohort}
          helperText={errors.cohort}
          label="Start cohort"
          value={formState.cohort}
          onChange={handleChange}
          maxLength={3}
        />
        <DropdownSelect
          disabled={isLoading}
          inputLabel="Learning status"
          id="learningStatus"
          name="learningStatus"
          label="Learning status"
          options={Object.values(LearningStatus)}
          isEditing
          value={formState.learningStatus}
          error={errors.learningStatus || ''}
          onChange={handleSelect}
        />
        <DropdownSelect
          disabled={isLoading}
          inputLabel="Job path"
          id="jobPath"
          name="jobPath"
          label="jobPath"
          options={Object.values(JobPath)}
          isEditing
          value={formState.jobPath}
          error={errors.jobPath || ''}
          onChange={handleSelect}
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <Button variant="outlined" color="secondary" disabled={isLoading} onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" loading={isLoading} disabled={isLoading}>
          Create
        </Button>
      </Stack>
    </form>
  );
};
