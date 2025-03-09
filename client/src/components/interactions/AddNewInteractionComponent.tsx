import { Box, Button, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState } from 'react';

import FormDateTextField from '../FormDateTextField';
import FormSelect from '../FormSelect';
import FormTextField from '../FormTextField';

const types = ['Call', 'Chat', 'Feedback', 'In person', 'Tech hour', 'Other'];

const AddNewInteractionComponent: React.FC = () => {
  const [type, setType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    // Handle the form submission logic here
    console.log('New interaction added:', type, title, comments);
  };

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value);
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeComments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComments(event.target.value);
  };

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(event.target.value));
  };

  return (
    <Box display="flex" flexDirection={'column'} gap={2}>
      <Typography variant="h5" color="text.primary" padding="16px" textAlign="center">
        Add new interaction
      </Typography>

      <Box display="flex" sx={{ gap: 3 }} justifyContent="space-between">
        <FormSelect
          id={'interactionType'}
          label="Type"
          value={type}
          onChange={onTypeChange}
          optionLabels={types}
          width={'40%'}
        />
        <FormTextField label="Title" placeholder="Optional title" value={title} onChange={onTitleChange} width="100%" />
        <FormDateTextField label="Date" value={date} onChange={onChangeDate} width="30%" />
      </Box>
      <FormTextField label="Comments" value={comments} onChange={onChangeComments} multiline minRows={2} maxRows={3} />

      <Button sx={{ alignSelf: 'flex-start' }} variant="outlined" color="primary" onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
};

export default AddNewInteractionComponent;
