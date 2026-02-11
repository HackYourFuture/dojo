import { Alert, Box, Button, Dialog, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { FormErrors, FormState, NewTraineeForm } from './components/NewTraineeForm';
import { JobPath, LearningStatus } from '../../../data/types/Trainee';
import { SubmitEventHandler, useState } from 'react';

import { useCreateTraineeProfile } from './data/mutations';
import { useNavigate } from 'react-router-dom';
import { validateForm } from './lib/formHelper';

// TODO: rename

interface CreateTraineeDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}
export const CreateTraineeDialog: React.FC<CreateTraineeDialogProps> = ({ isOpen, handleClose }) => {
  const navigate = useNavigate();
  const {
    mutate: createTrainee,
    isPending,
    error: submitError,
  } = useCreateTraineeProfile({
    onSuccess: (profilePath: string) => onSuccess(profilePath),
  });

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

  const onSuccess = (path: string) => {
    handleClose();
    navigate(path);
  };
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
      return;
    }

    createTrainee(formState);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
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
          handleClose={handleClose}
        />

        {submitError && (
          <Box paddingTop={2}>
            <Alert severity="error">An error occurred while creating the trainee profile: {submitError.message}</Alert>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
