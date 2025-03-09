import { Box, Button, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState } from 'react';

import FormDateTextField from '../FormDateTextField';
import FormSelect from '../FormSelect';
import FormTextField from '../FormTextField';

const types = ['Call', 'Chat', 'Feedback', 'In person', 'Tech hour', 'Other'];

interface InteractionFormState {
  type: string;
  title: string;
  comments: string;
  date: Date;
}

const initialState: InteractionFormState = {
  type: '',
  title: '',
  comments: '',
  date: new Date(),
};

const AddNewInteractionComponent: React.FC = () => {
  const [formState, setFormState] = useState<InteractionFormState>(initialState);

  const handleSubmit = () => {
    // Handle the form submission logic here
    console.log('New interaction added:', formState);
  };

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    setFormState((prev) => ({ ...prev, type: event.target.value }));
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, title: event.target.value }));
  };

  const onChangeComments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, comments: event.target.value }));
  };

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, date: new Date(event.target.value) }));
  };

  return (
    <Box display="flex" flexDirection={'column'} gap={2} paddingBottom={2}>
      <Typography variant="h5" color="text.primary" padding="5px">
        Add a new interaction
      </Typography>

      <Box display="flex" sx={{ gap: 3 }} justifyContent="space-between">
        <FormSelect
          id={'interactionType'}
          label="Type"
          value={formState.type}
          onChange={onTypeChange}
          optionLabels={types}
          width={'40%'}
          required
        />
        <FormTextField
          label="Title"
          placeholder="Optional title"
          value={formState.title}
          onChange={onTitleChange}
          width="100%"
        />
        <FormDateTextField label="Date" value={formState.date} onChange={onChangeDate} width="35%" />
      </Box>
      <FormTextField
        label="Comments"
        value={formState.comments}
        onChange={onChangeComments}
        multiline
        minRows={4}
        maxRows={10}
      />

      <Button sx={{ alignSelf: 'flex-start' }} variant="outlined" color="primary" onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
};

export default AddNewInteractionComponent;
