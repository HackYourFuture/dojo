import { Add } from '@mui/icons-material';
import { AddTraineeDialog } from '../../trainee-profile/create/CreateTraineeDialog';
import { ButtonWithIcon } from '../../../components/ButtonWithIcon';
import { Card } from '@mui/material';
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
    <Card
      variant="outlined"
      sx={{ my: 2, paddingTop: 2, paddingBottom: 2, display: 'flex', justifyContent: 'flex-end', paddingRight: 2 }}
    >
      <AddTraineeDialog
        key={`add-trainee-open-${isAddTraineeDialogOpen}`}
        isOpen={isAddTraineeDialogOpen}
        handleClose={handleCloseAddTraineeDialog}
      />
      <ButtonWithIcon text="Add Trainee" startIcon={<Add />} onClick={handleOpenAddTraineeDialog} />
    </Card>
  );
};
