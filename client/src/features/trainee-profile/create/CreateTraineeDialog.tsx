import { Box, Dialog, SelectChangeEvent, Typography } from '@mui/material';
import { FormErrors, FormState, NewTraineeForm } from './components/NewTraineeForm';
import { JobPath, LearningStatus } from '../../../data/types/Trainee';
import { SubmitEventHandler, useState } from 'react';

import { useCreateTraineeProfile } from './data/mutations';
import { validateForm } from './lib/formHelper';

export const CreateTraineeDialog: React.FC = () => {
  const { mutate: createTrainee, isPending, data } = useCreateTraineeProfile();
  const [errors, setErrors] = useState<FormErrors>({});

  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    gender: null,
    email: '',
    cohort: 0,
    learningStatus: LearningStatus.Studying,
    jobPath: JobPath.NotGraduated,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState: FormState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<String | number>) => {
    const { name, value } = event.target;

    setFormState((prevState: FormState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
  };

  return (
    <Dialog open={true} onClose={() => {}} fullWidth maxWidth="sm">
      <Box padding={5} sx={{ backgroundColor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          New trainee profile
        </Typography>
        <NewTraineeForm
          isLoading={isPending}
          formState={formState}
          errors={errors}
          handleChange={handleTextChange}
          handleSelect={handleSelectChange}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Dialog>
  );
};
