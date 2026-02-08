import { Box, Dialog, SelectChangeEvent, Typography } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';

import { Gender } from '../../../data/types/Trainee';
import { GenderSelect } from '../profile/components/GenderSelect';
import TextFieldWrapper from './components/TextFieldWrapper';

export const CreateTraineeDialog: React.FC = () => {
  const [gender, setGender] = useState<Gender | null>(null);
  const onSelectGender = (event: SelectChangeEvent) => {
    setGender(event.target.value as Gender);
  };
  return (
    <Dialog open={false} onClose={() => {}} fullWidth maxWidth="sm">
      <Box>
        <Typography variant="h4" gutterBottom>
          Create Trainee Profile
        </Typography>
        {/* Form fields for creating a trainee profile would go here */}

        <TextFieldWrapper placeholder="First name" />
        <TextFieldWrapper placeholder="Last name" />
        <GenderSelect isEditing={true} gender={gender} onChange={onSelectGender} />
        <TextFieldWrapper placeholder="email" />
        <TextFieldWrapper placeholder="cohort" />
      </Box>
    </Dialog>
  );
};
