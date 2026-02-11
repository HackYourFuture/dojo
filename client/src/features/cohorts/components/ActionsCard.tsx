import { Add } from '@mui/icons-material';
import { AddTraineeDialog } from '../../trainee-profile/create/AddTraineeDialog';
import { Box } from '@mui/material';
import { ButtonWithIcon } from '../../../components/ButtonWithIcon';
import { useState } from 'react';

export const ActionsCard = () => {
  const [isAddTraineeDialogOpen, setIsAddTraineeDialogOpen] = useState(false);

  const handleOpenAddTraineeDialog = () => {
    setIsAddTraineeDialogOpen(true);
  };

  const handleCloseAddTraineeDialog = () => {
    setIsAddTraineeDialogOpen(false);
  };
  return (
    <Box sx={{ my: 2, paddingTop: 2, paddingBottom: 2, display: 'flex', justifyContent: 'flex-end', paddingRight: 2 }}>
      <AddTraineeDialog
        key={`add-trainee-open-${isAddTraineeDialogOpen}`}
        isOpen={isAddTraineeDialogOpen}
        handleClose={handleCloseAddTraineeDialog}
      />
      <ButtonWithIcon text="Add Trainee" startIcon={<Add />} onClick={handleOpenAddTraineeDialog} />
    </Box>
  );
};
