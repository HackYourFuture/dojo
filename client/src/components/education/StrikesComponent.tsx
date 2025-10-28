import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddStrike, useDeleteStrike, useEditStrike, useGetStrikes } from '../../hooks/education/strike-queries';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Strike } from '../../models';
import { StrikeDetailsModal } from './StrikeDetailsModal';
import { StrikesList } from './StrikesList';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../hooks/useTraineeProfileContext';

export const StrikesComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //NOTE: bool for modal state

  const [modalError, setModalError] = useState<string>(''); //NOTE: string for modal error
  const [strikeToEdit, setStrikeToEdit] = useState<Strike | null>(null); //NOTE: strike to edit state
  const { traineeId } = useTraineeProfileContext(); //NOTE: collects id from context
  const { mutate: addStrike, isLoading: addStrikeLoading } = useAddStrike(traineeId); //NOTE: how does mutate work? this is for the database
  const { mutate: deleteStrike, isLoading: deleteStrikeLoading, error: deleteStrikeError } = useDeleteStrike(traineeId);
  const { mutate: editStrike, isLoading: editStrikeLoading } = useEditStrike(traineeId);
  const { data: strikes, isLoading: strikesLoading, error: strikesError } = useGetStrikes(traineeId); //NOTE: gets strikes and state from database traineeId
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false); //NOTE: bool for confirmation dialog

  const [idToDelete, setIdToDelete] = useState<string>(''); //TODO: how does this work
  const queryClient = useQueryClient();
  const handleSuccess = () => {
    queryClient.invalidateQueries(['strikes', traineeId]);
    setIsModalOpen(false);
  };

  const getErrorMessage = (error: Error | unknown) => {  //NOTE: gives the error message for the strikes list
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => { //NOTE: edits the id'ed strike
    const strike = strikes?.find((strike) => strike.id === id) || null;

    setStrikeToEdit(strike);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (strike: Strike) => { //NOTE: add strike when confirmed
    addStrike(strike, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (strike: Strike) => { //NOTE: push edit when confirmed
    editStrike(strike, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onClickDelete = (id: string) => { //NOTE: Shows confirmation button
    setIdToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  /**
   * Function to enable adding strikes.
   */
  const onClickAdd = () => { //TODO: Fix this issue
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
