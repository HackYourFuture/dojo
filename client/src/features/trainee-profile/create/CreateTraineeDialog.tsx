import { Background, Gender, JobPath, LearningStatus } from '../../../data/types/Trainee';
import { Box, Button, Dialog, SelectChangeEvent, Stack, Typography } from '@mui/material';

import { GenderSelect } from '../profile/components/GenderSelect';
import TextFieldWrapper from './components/TextFieldWrapper';
import { useCreateTraineeForm } from './hooks/useCreateTraineeForm';

let counter = 0;

export const CreateTraineeDialog: React.FC = () => {
  const { formState, setFormState, onSelectGender, handleChange, handleSubmit, errors } = useCreateTraineeForm();

  console.log('reloading', counter++);
  return (
    <Dialog open={true} onClose={() => {}} fullWidth maxWidth="sm">
      <Box padding={5} sx={{ backgroundColor: 'Background.paper' }}>
        <Typography variant="h4" gutterBottom>
          New trainee profile
        </Typography>
        {/* Form fields for creating a trainee profile would go here */}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextFieldWrapper
              id="firstName"
              name="firstName"
              error={!!errors.firstName}
              helperText={errors.firstName}
              label="First name"
              value={formState.firstName}
              onChange={handleChange}
            />
            <TextFieldWrapper
              id="lastName"
              name="lastName"
              error={!!errors.lastName}
              helperText={errors.lastName}
              label="Last name"
              value={formState.lastName}
              onChange={handleChange}
            />
            <GenderSelect error={errors.gender} isEditing={true} gender={formState.gender} onChange={onSelectGender} />
            <TextFieldWrapper
              id="email"
              name="email"
              type="email"
              error={!!errors.email}
              helperText={errors.email}
              label="Email"
              value={formState.email}
              onChange={handleChange}
            />
            <TextFieldWrapper
              id="startCohort"
              name="startCohort"
              type="number"
              error={!!errors.startCohort}
              helperText={errors.startCohort}
              label="Start cohort"
              value={formState.startCohort}
              onChange={handleChange}
            />
            <TextFieldWrapper
              id="learningStatus"
              name="learningStatus"
              label="Learning status"
              onChange={handleChange}
              value={formState.learningStatus}
            />
            <TextFieldWrapper
              id="jobPath"
              name="jobPath"
              label="Job path"
              value={formState.jobPath}
              onChange={handleChange}
            />
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
            <Button variant="outlined" color="secondary">
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
