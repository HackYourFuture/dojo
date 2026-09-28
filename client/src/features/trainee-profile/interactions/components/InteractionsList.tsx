import { Alert, Box, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { useState } from 'react';

import { AvatarWithTooltip } from '../../education/components/AvatarWithTooltip';
import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';
import { Interaction } from '../models/interaction';
import { ListItemActions } from '../../components/ListItemActions';
import MarkdownText from '../../components/MarkdownText';
import { formatDateForDisplay } from '../../utils/dateHelper';
import { formatTextToFriendly } from '../../utils/formHelper';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useDeleteInteraction } from '../data/mutations';

interface InteractionsListProps {
  interactions: Interaction[];
  traineeId: string;
  onClickEdit: (id: string) => void;
}
const InteractionsList: React.FC<InteractionsListProps> = ({ interactions, traineeId, onClickEdit }) => {
  const { user } = useAuth();
  const { mutate: deleteInteraction, isPending: isDeleteLoading } = useDeleteInteraction(traineeId);
  const [error, setError] = useState<string>('');
  const [interactionToDelete, setInteractionToDelete] = React.useState<Interaction | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleClickOnDeleteButton = (interaction: Interaction) => {
    setError('');
    setInteractionToDelete(interaction);
    setIsModalOpen(true);
  };

  const onConfirmDelete = () => {
    if (!interactionToDelete) {
      return;
    }
    deleteInteraction(interactionToDelete.id, {
      onSuccess: () => {
        setIsModalOpen(false);
        setInteractionToDelete(null);
      },
      onError: (error) => {
        // Close the dialog so the error above the list is visible.
        setIsModalOpen(false);
        setError(error.message);
      },
    });
  };

  const onCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isModalOpen}
        title="Confirm Delete"
        message={`
        Are you sure you want to delete the following interaction: ${interactionToDelete?.title || interactionToDelete?.type}
      `}
        isLoading={isDeleteLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        <List
          sx={{
            width: '100%',
            overflow: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {interactions.length === 0 ? (
            <Typography variant="body1" color="text.secondary" padding="16px" textAlign="center">
              No interactions yet!
            </Typography>
          ) : (
            interactions?.map((interaction: Interaction, index: number) => {
              return (
                <ListItem
                  key={interaction.id}
                  alignItems="flex-start"
                  disablePadding
                  sx={{
                    paddingBottom: 1,
                    bgcolor: index % 2 === 0 ? 'background.paperAlt' : 'background.paper',
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 2,
                      paddingRight: 2,
                      paddingTop: 1,
                    }}
                  >
                    <AvatarWithTooltip imageUrl={interaction.reporter.thumbnailUrl} name={interaction.reporter.name} />
                  </ListItemAvatar>
                  <ListItemText
                    // A div, since the markdown details render paragraphs, which cannot be inside the default <p>.
                    slotProps={{ secondary: { component: 'div' } }}
                    primary={
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        width="100%"
                        paddingTop={1}
                        paddingBottom={1}
                      >
                        <Box display="flex" flexDirection="row" gap={1}>
                          <Chip label={formatTextToFriendly(interaction.type)} color="primary" size="small" />
                          <Typography>{interaction.title}</Typography>
                        </Box>
                        <Typography sx={{ paddingRight: 2 }}>{formatDateForDisplay(interaction.date)}</Typography>
                      </Box>
                    }
                    secondary={<MarkdownText>{interaction.details}</MarkdownText>}
                  />
                  {/* Only the reporter may edit or delete an interaction. */}
                  {interaction.reporter.id === user?.id && (
                    <ListItemActions
                      onEdit={() => onClickEdit(interaction.id)}
                      onDelete={() => handleClickOnDeleteButton(interaction)}
                    />
                  )}
                </ListItem>
              );
            })
          )}
        </List>
      </Box>
    </React.Fragment>
  );
};

export default InteractionsList;
