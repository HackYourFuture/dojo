import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { INTERACTION_TYPES, Interaction } from './Interaction';
import { useAddInteraction, useEditInteraction } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { InteractionDetailsModal } from './components/InteractionDetailsModal';
import InteractionsList from './components/InteractionsList';
import { ProfileSection } from '../../components/profile/ProfileSection';
import { ProfileType } from '../../data/types/ProfileType';
import { useGetInteractions } from './data/interaction-queries';
import { useState } from 'react';

interface InteractionsInfoProps {
  profileType: ProfileType;
  profileId: string;
}

/** The interactions tab of a trainee or an organisation profile. */
const InteractionsInfo = ({ profileType, profileId }: InteractionsInfoProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [interactionToEdit, setInteractionToEdit] = useState<Interaction | null>(null);

  const { mutate: addInteraction, isPending: addInteractionLoading } = useAddInteraction(profileType, profileId);
  const { mutate: editInteraction, isPending: editInteractionLoading } = useEditInteraction(profileType, profileId);
  const {
    data: interactions,
    isLoading: interactionsLoading,
    error: interactionsError,
  } = useGetInteractions(profileType, profileId);

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

  const onConfirmAdd = (interaction: Interaction) => {
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
    <Box sx={{ maxWidth: 1000 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <InteractionsList
            profileType={profileType}
            profileId={profileId}
            interactions={interactions || []}
            onClickEdit={onClickEdit}
          />
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
        types={INTERACTION_TYPES[profileType]}
      />
    </Box>
  );
};

export default InteractionsInfo;
