import { Alert, Box, Dialog, SelectChangeEvent, Typography } from '@mui/material';
import { FormErrors, NewTraineeForm } from './components/NewTraineeForm';
import { JobPath, LearningStatus, NewTrainee } from '../../../data/types/Trainee';

import { useCreateTrainee } from '../data/mutations';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateAndCollectFormErrors } from './lib/formValidation';

interface AddTraineeDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}
export const AddTraineeDialog: React.FC<AddTraineeDialogProps> = ({ isOpen, handleClose }) => {
  const initialState: NewTrainee = {
    firstName: '',
    lastName: '',
    gender: null,
    email: '',
    cohort: 0,
    learningStatus: LearningStatus.Studying,
    jobPath: JobPath.NotGraduated,
  };

  const navigate = useNavigate();
  const { mutate: createTrainee, isPending, error: submitError } = useCreateTrainee();

  const [errors, setErrors] = useState<FormErrors | null>(null);

  const [formState, setFormState] = useState<NewTrainee>(initialState);
  const onClose = () => {
    setFormState(initialState);
    setErrors(null);
    handleClose();
  };

  const onSuccess = (path: string) => {
    onClose();
    navigate(path);
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState: NewTrainee) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;

    setFormState((prevState: NewTrainee) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = (event) => {
    event.preventDefault();
    const errors = validateAndCollectFormErrors(formState);

    if (errors) {
      setErrors(errors);
      return;
    }
    createTrainee(formState, { onSuccess: (trainee) => onSuccess(trainee.profilePath) });
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
          handleClose={onClose}
        />

        {submitError && (
          <Box paddingTop={2}>
            <Alert severity="error">
              An error occurred while creating the trainee profile: {submitError.message || 'unknown'}
            </Alert>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
