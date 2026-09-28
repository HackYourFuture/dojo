import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useAddInteraction, useEditInteraction } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { Interaction } from './models/interaction';
import { InteractionDetailsModal } from './components/InteractionDetailsModal';
import InteractionsList from './components/InteractionsList';
import { ProfileSection } from '../profile/components/ProfileSection';
import { useGetInteractions } from './data/interaction-queries';
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
    if (modalError) {
      setModalError('');
    }
    addInteraction(interaction, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError(e.message);
      },
    });
  };

  const onConfirmEdit = (interaction: Interaction) => {
    if (modalError) {
      setModalError('');
    }
    editInteraction(interaction, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError(e.message);
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
    <Box maxWidth={1000}>
      <ProfileSection
        title={`Interactions (${interactions?.length || 0})`}
        action={
          <Button startIcon={<AddIcon />} onClick={onClickAdd}>
            New Interaction
          </Button>
        }
      >
        {interactionsError ? (
          <Alert severity="error">Oopsie! Something went wrong: {getErrorMessage(interactionsError)}</Alert>
        ) : interactionsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <InteractionsList traineeId={traineeId} interactions={interactions || []} onClickEdit={onClickEdit} />
        )}
      </ProfileSection>

      <InteractionDetailsModal
        key={interactionToEdit?.id || `add-interaction-${isModalOpen}`} // Use interaction ID for edit mode, and a unique key for add mode to force remounting
        isLoading={addInteractionLoading || editInteractionLoading}
        error={modalError}
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirmAdd={onConfirmAdd}
        onConfirmEdit={onConfirmEdit}
        initialInteraction={interactionToEdit}
      />
    </Box>
  );
};

export default InteractionsInfo;
