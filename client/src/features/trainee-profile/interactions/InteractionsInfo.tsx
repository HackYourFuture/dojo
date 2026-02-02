import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddInteraction, useEditInteraction, useGetInteractions } from './data/interaction-queries';

import AddIcon from '@mui/icons-material/Add';
import { Interaction } from './Interactions';
import { InteractionDetailsModal } from './components/InteractionDetailsModal';
import InteractionsList from './components/InteractionsList';
import { useState } from 'react';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

const InteractionsInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [interactionToEdit, setInteractionToEdit] = useState<Interaction | null>(null);
  const { traineeId } = useTraineeProfileContext();

  const { mutate: addInteraction, isPending: addInteractionLoading } = useAddInteraction(traineeId);
  const { mutate: editInteraction, isPending: editInteractionLoading } = useEditInteraction(traineeId);
  const {
    data: interactions,
    isLoading: interactionsLoading,
    error: interactionsError,
  } = useGetInteractions(traineeId);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setInteractionToEdit(null);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const interaction = interactions?.find((interaction) => interaction.id === id) || null;
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

  return (
    <>
      <Box padding="24px" maxWidth={1000} paddingRight={10}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" padding="16px">
            Interactions ({interactions?.length || 0})
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={onClickAdd}>
              New Interaction
            </Button>
          </Stack>
        </Box>

        {interactionsError ? (
          <Alert severity="error">Oopsie! Something went wrong: {getErrorMessage(interactionsError)}</Alert>
        ) : interactionsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <InteractionsList traineeId={traineeId} interactions={interactions || []} onClickEdit={onClickEdit} />
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

export default InteractionsInfo;
