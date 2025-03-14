import { Alert, Box, Paper, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState } from 'react';

import FormDateTextField from './FormDateTextField';
import FormSelect from './FormSelect';
import FormTextField from './FormTextField';
import { Interaction } from '../../models/Interactions';
import { InteractionType } from '../../models/Interactions';
import { LoadingButton } from '@mui/lab';
import { useAddInteraction } from '../../hooks/interactions/interaction-queries';

const types = Object.values(InteractionType);

type FormState = Partial<Interaction>;

const initialState: FormState = {
  title: '',
  details: '',
  date: new Date(),
};

interface AddNewInteractionComponentProps {
  traineeId: string;
}

const AddNewInteractionComponent: React.FC<AddNewInteractionComponentProps> = ({ traineeId }) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [error, setError] = useState<string>('');

  const { isLoading, mutateAsync: addInteraction } = useAddInteraction(traineeId);

  const handleSubmit = () => {
    setError('');

    if (!formState.type || !formState.details) {
      setError('Please fill in all required fields');
      return;
    }

    addInteraction(formState, {
      onSuccess: () => {
        setFormState(initialState);
      },
      onError: (error) => {
        if (error instanceof Error) {
          setError(error.message);
        }
      },
    });
  };

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    setFormState((prev) => ({ ...prev, type: event.target.value as InteractionType }));
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, title: event.target.value }));
  };

  const onChangeComments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, details: event.target.value }));
  };

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, date: new Date(event.target.value) }));
  };

  return (
    <Paper elevation={1} sx={{ padding: 2, marginBottom: 3 }}>
      <Box display="flex" flexDirection={'column'} gap={2}>
        <Typography variant="h5" color="text.primary" padding="5px">
          Add a new interaction
        </Typography>

        <Box display="flex" sx={{ gap: 3 }} justifyContent="space-between">
          <FormSelect
            disabled={isLoading}
            id={'interactionType'}
            label="Type"
            value={formState.type}
            onChange={onTypeChange}
            optionLabels={types}
            width={'40%'}
            required
          />
          <FormTextField
            disabled={isLoading}
            label="Title"
            placeholder="Optional title"
            value={formState.title}
            onChange={onTitleChange}
            width="100%"
          />
          <FormDateTextField
            label="Date"
            value={formState.date || new Date()}
            onChange={onChangeDate}
            width="35%"
            disabled={isLoading}
          />
        </Box>
        <FormTextField
          disabled={isLoading}
          label="Comments"
          value={formState.details}
          onChange={onChangeComments}
          multiline
          minRows={4}
          maxRows={10}
          required
        />

        <LoadingButton
          sx={{ alignSelf: 'flex-start' }}
          variant="outlined"
          color="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Add
        </LoadingButton>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default AddNewInteractionComponent;
