import { Alert, Box, Chip, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

import { AvatarWithTooltip } from './AvatarWithTooltip';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { Interaction } from '../Interaction';
import { ListItemActions } from '../../../components/ListItemActions';
import MarkdownText from '../../trainee-profile/components/MarkdownText';
import { ProfileType } from '../../../data/types/ProfileType';
import { formatDateForDisplay, formatDateTimeForDisplay } from '../../trainee-profile/utils/dateHelper';
import { formatTextToFriendly } from '../../trainee-profile/utils/formHelper';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useDeleteInteraction } from '../data/mutations';

interface InteractionsListProps {
  interactions: Interaction[];
  profileType: ProfileType;
  profileId: string;
  onClickEdit: (id: string) => void;
}
const InteractionsList: React.FC<InteractionsListProps> = ({ interactions, profileType, profileId, onClickEdit }) => {
  const { user } = useAuth();
  const { mutate: deleteInteraction, isPending: isDeleteLoading } = useDeleteInteraction(profileType, profileId);
  const [error, setError] = useState<string>('');
  // Kept after the confirmation closes, so the title in it does not disappear while it fades out.
  const [interactionToDelete, setInteractionToDelete] = useState<Interaction | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);

  const handleClickOnDeleteButton = (interaction: Interaction) => {
    setError('');
    setInteractionToDelete(interaction);
    setIsConfirmationDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (!interactionToDelete) {
      return;
    }
    deleteInteraction(interactionToDelete.id, {
      // Also closes on failure, so the error above the list is not hidden behind the dialog.
      onSettled: () => {
        setIsConfirmationDialogOpen(false);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  return (
    <React.Fragment>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete the following interaction: ${interactionToDelete?.title}`}
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
                        <Tooltip title={formatDateTimeForDisplay(interaction.date)} placement="top">
                          <Typography sx={{ paddingRight: 2 }}>{formatDateForDisplay(interaction.date)}</Typography>
                        </Tooltip>
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
