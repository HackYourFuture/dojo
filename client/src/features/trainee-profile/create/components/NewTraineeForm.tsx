import { Button, SelectChangeEvent, Stack } from '@mui/material';
import { Gender, JobPath, LearningStatus } from '../../../../data/types/Trainee';

import { GenderSelect } from '../../profile/components/GenderSelect';
import { JobPathSelect } from '../../profile/components/JobPathSelect';
import { LearningStatusSelect } from '../../profile/components/LearningStatusSelect';
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
  firstName?: string;
  lastName?: string;
  gender?: string;
  email?: string;
  cohort?: string;
};

export const NewTraineeForm: React.FC<{
  isLoading: boolean;
  formState: FormState;
  errors: FormErrors | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSelect: (event: SelectChangeEvent<string | number>) => void;
  handleSubmit: React.ComponentProps<'form'>['onSubmit'];
}> = ({ isLoading, formState, errors, handleChange, handleSelect, handleSubmit, handleClose }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} pt={2}>
        <TextFieldWrapper
          disabled={isLoading}
          id="firstName"
          name="firstName"
          error={!!errors?.firstName}
          helperText={errors?.firstName}
          label="First name"
          value={formState.firstName}
          onChange={handleChange}
        />
        <TextFieldWrapper
          disabled={isLoading}
          id="lastName"
          name="lastName"
          error={!!errors?.lastName}
          helperText={errors?.lastName}
          label="Last name"
          value={formState.lastName}
          onChange={handleChange}
        />
        <GenderSelect
          disabled={isLoading}
          isEditing
          value={formState.gender || undefined}
          error={errors?.gender || ''}
          onChange={handleSelect}
        />
        <TextFieldWrapper
          disabled={isLoading}
          id="email"
          name="email"
          error={!!errors?.email}
          helperText={errors?.email}
          label="Email"
          value={formState.email}
          onChange={handleChange}
        />
        <Stack direction="row" spacing={2} pb={2}>
          <TextFieldWrapper
            disabled={isLoading}
            id="cohort"
            name="cohort"
            type="number"
            error={!!errors?.cohort}
            helperText={errors?.cohort}
            label="Start cohort"
            value={formState.cohort}
            onChange={handleChange}
            maxLength={3}
          />

          <LearningStatusSelect
            disabled={isLoading}
            isEditing
            value={formState.learningStatus}
            onChange={handleSelect}
          />
          <JobPathSelect disabled={isLoading} isEditing value={formState.jobPath} onChange={handleSelect} />
        </Stack>
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
