import { Background, Gender, JobPath, LearningStatus } from '../../../data/types/Trainee';
import { Box, Button, Dialog, SelectChangeEvent, Stack, Typography } from '@mui/material';

import { DropdownSelect } from '../profile/components/DropdownSelect';
import { GenderSelect } from '../profile/components/GenderSelect';
import TextFieldWrapper from './components/TextFieldWrapper';
import { useCreateTraineeForm } from './hooks/useCreateTraineeForm';

export const CreateTraineeDialog: React.FC = () => {
  const { formState, onSelectGender, handleChange, handleSelect, handleSubmit, errors, isPending } =
    useCreateTraineeForm();

  return (
    <Dialog open={true} onClose={() => {}} fullWidth maxWidth="sm">
      <Box padding={5} sx={{ backgroundColor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          New trainee profile
        </Typography>
        {/* Form fields for creating a trainee profile would go here */}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextFieldWrapper
              disabled={isPending}
              id="firstName"
              name="firstName"
              error={!!errors.firstName}
              helperText={errors.firstName}
              label="First name"
              value={formState.firstName}
              onChange={handleChange}
            />
            <TextFieldWrapper
              disabled={isPending}
              id="lastName"
              name="lastName"
              error={!!errors.lastName}
              helperText={errors.lastName}
              label="Last name"
              value={formState.lastName}
              onChange={handleChange}
            />
            <GenderSelect
              disabled={isPending}
              error={errors.gender || ''}
              isEditing={true}
              gender={formState.gender}
              onChange={onSelectGender}
            />
            <TextFieldWrapper
              disabled={isPending}
              id="email"
              name="email"
              error={!!errors.email}
              helperText={errors.email}
              label="Email"
              value={formState.email}
              onChange={handleChange}
            />
            <TextFieldWrapper
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
            <Button variant="outlined" color="secondary" disabled={isPending} onClick={() => {}}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" loading={isPending} disabled={isPending}>
              Create
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
