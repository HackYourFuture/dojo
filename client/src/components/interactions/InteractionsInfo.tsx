import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddInteraction, useDeleteInteraction, useEditInteraction, useGetInteractions } from '../../hooks/interactions/interaction-queries';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Interaction} from '../../models/Interactions';
import { InteractionDetailsModal } from './InteractionDetailsModal';
import InteractionsList from './InteractionsList';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../hooks/useTraineeProfileContext';

export const InteractionsInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [interactionToEdit, setInteractionToEdit] = useState<Interaction | null>(null);
  const { traineeId } = useTraineeProfileContext();
  
  const { mutate: addInteraction, isLoading: addInteractionLoading } = useAddInteraction(traineeId);
  const { mutate: deleteInteraction, isLoading: deleteInteractionLoading, error: deleteInteractionError } = useDeleteInteraction(traineeId);
  const { mutate: editInteraction, isLoading: editInteractionLoading } = useEditInteraction(traineeId);
  const { data: interactions, isLoading: interactionsLoading, error: interactionsError } = useGetInteractions(traineeId);
  
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>('');
  
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries(['interactions', traineeId]);
    setIsModalOpen(false);
    setInteractionToEdit(null);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const interaction = interactions?.find((interaction) => interaction.id === id) || null;
    //if (interaction) console.log(interaction.id);
    setInteractionToEdit(interaction);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (interaction: Interaction) => {
    addInteraction(interaction, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (interaction: Interaction) => {
    editInteraction(interaction, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };


  const onClickAdd = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInteractionToEdit(null);
    setModalError('');
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    deleteInteraction(idToDelete, {
      onSuccess: () => {
        setIsConfirmationDialogOpen(false);
        queryClient.invalidateQueries(['interactions', traineeId]);
      },
    });
  };

  return (
    <>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this interaction?"
        isLoading={deleteInteractionLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <Box padding="24px" maxWidth={1000} paddingRight={10}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" color="black" padding="16px">
            Interactions ({interactions?.length || 0})
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={onClickAdd}>
              New Interaction
            </Button>
          </Stack>
        </Box>

        {interactionsError || deleteInteractionError ? (
          <Alert severity="error">
            Oopsie! Something went wrong: {getErrorMessage(interactionsError || deleteInteractionError)}
          </Alert>
        ) : interactionsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <InteractionsList 
            traineeId={traineeId} 
            interactions={interactions || []} 
            onClickEdit={onClickEdit}
          />
        )}

        <InteractionDetailsModal
          isLoading={addInteractionLoading || editInteractionLoading}
          error={modalError}
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirmAdd={onConfirmAdd}
          onConfirmEdit={onConfirmEdit}
          interactionToEdit={interactionToEdit}
        />
      </Box>
    </>
  );
};
