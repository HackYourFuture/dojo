import { Box, Button } from '@mui/material';

import { Add } from '@mui/icons-material';
import { AddTraineeDialog } from '../../trainee-profile/create/AddTraineeDialog';
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
      <AddTraineeDialog isOpen={isAddTraineeDialogOpen} handleClose={handleCloseAddTraineeDialog} />
      <Button variant="contained" startIcon={<Add />} onClick={handleOpenAddTraineeDialog}>
        Add Trainee
      </Button>
    </Box>
  );
};
