import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddStrike, useDeleteStrike, useEditStrike } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';
import { Strike } from './models/strike';
import { StrikeDetailsModal } from './StrikeDetailsModal';
import { StrikesList } from './StrikesList';
import { useGetStrikes } from './data/strike-queries';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';

export const StrikesComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalError, setModalError] = useState<string>('');
  const [strikeToEdit, setStrikeToEdit] = useState<Strike | null>(null);
  const { traineeId } = useTraineeProfileContext();
  const { mutate: addStrike, isPending: addStrikeLoading } = useAddStrike(traineeId);
  const { mutate: deleteStrike, isPending: deleteStrikeLoading, error: deleteStrikeError } = useDeleteStrike(traineeId);
  const { mutate: editStrike, isPending: editStrikeLoading } = useEditStrike(traineeId);
  const { data: strikes, isPending: strikesLoading, error: strikesError } = useGetStrikes(traineeId);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const [idToDelete, setIdToDelete] = useState<string>('');
  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const strike = strikes?.find((strike: Strike) => strike.id === id) || null;

    setStrikeToEdit(strike);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (strike: Strike) => {
    if (modalError) setModalError('');
    addStrike(strike, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (strike: Strike) => {
    if (modalError) setModalError('');
    editStrike(strike, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onClickDelete = (id: string) => {
    setIdToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  /**
   * Function to enable adding strikes.
   */
  const onClickAdd = () => {
    setStrikeToEdit(null);
    setIsModalOpen(true);
  };

  /**
   * Function to cancel adding strikes.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setStrikeToEdit(null);
    setModalError('');
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    deleteStrike(idToDelete, {
      onSuccess: () => {
        setIsConfirmationDialogOpen(false);
      },
    });
  };

  return (
    <>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this strike?"
        isLoading={deleteStrikeLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <div style={{ width: '50%' }}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" padding="16px">
            Strikes ({strikes?.length || 0})
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={onClickAdd}>
              New strike
            </Button>
          </Stack>
        </Box>

        {strikesError || deleteStrikeError ? (
          <Alert severity="error">
            Oopsie! Something went wrong: {getErrorMessage(strikesError || deleteStrikeError)}
          </Alert>
        ) : strikesLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <StrikesList strikes={strikes || []} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
        )}
        <StrikeDetailsModal
          key={strikeToEdit?.id || `add-strike-${isModalOpen}`} // Use strike ID for edit mode, and a unique key for add mode to force remounting
          isLoading={addStrikeLoading || editStrikeLoading}
          error={modalError}
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirmAdd={onConfirmAdd}
          onConfirmEdit={onConfirmEdit}
          initialStrike={strikeToEdit}
        />
      </div>
    </>
  );
};
