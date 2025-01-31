import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddStrike, useDeleteStrike, useEditStrike, useGetStrikes } from '../../hooks/education/strike-queries';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Strike } from '../../models';
import { StrikeDetailsModal } from './StrikeDetailsModal';
import { StrikesList } from './StrikesList';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../hooks/traineeProfileContext';

export const StrikesComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalError, setModalError] = useState<string>('');
  const [strikeToEdit, setStrikeToEdit] = useState<Strike | null>(null);
  const { traineeId } = useTraineeProfileContext();
  const { mutate: addStrike, isLoading: addStrikeLoading } = useAddStrike(traineeId);
  const { mutate: deleteStrike, isLoading: deleteStrikeLoading, error: deleteStrikeError } = useDeleteStrike(traineeId);
  const { mutate: editStrike, isLoading: editStrikeLoading } = useEditStrike(traineeId);
  const { data: strikes, isLoading: strikesLoading, error: strikesError } = useGetStrikes(traineeId);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [idToDelete, setIdToDelete] = useState<string>('');
  const queryClient = useQueryClient();
  const onSuccess = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries(['strikes', traineeId]);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const strike = strikes?.find((strike) => strike.id === id);
    setStrikeToEdit(strike || null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (strike: Strike) => {
    setIsEditMode(false);
    addStrike(strike, {
      onSuccess: onSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (strike: Strike) => {
    editStrike(strike, {
      onSuccess: onSuccess,
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
        queryClient.invalidateQueries(['strikes', traineeId]);
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
          <Typography variant="h6" color="black" padding="16px">
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
          isLoading={addStrikeLoading || editStrikeLoading}
          editMode={isEditMode}
          error={modalError}
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirmAdd={onConfirmAdd}
          onConfirmEdit={onConfirmEdit}
          strikeToEdit={strikeToEdit}
        />
      </div>
    </>
  );
};
