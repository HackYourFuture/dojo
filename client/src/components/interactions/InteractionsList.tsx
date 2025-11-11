import { Alert, Box, Chip, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { useState } from 'react';

import { AvatarWithTooltip } from '../shared/AvatarWithTooltip';
import { ConfirmationDialog } from '../ConfirmationDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { Interaction } from '../../models/Interactions';
import { formatDateForDisplay } from '../../helpers/dateHelper';
import { formatTextToFriendly } from '../../helpers/formHelper';
import { useDeleteInteraction } from '../../hooks/interactions/interaction-queries';
import MarkdownText from '../shared/MarkdownText';
import EditIcon from '@mui/icons-material/Edit';


interface InteractionsListProps {
  interactions: Interaction[];
  traineeId: string;
  onClickEdit: (id: string) => void;
}
const InteractionsList: React.FC<InteractionsListProps> = ({ interactions, traineeId, onClickEdit }) => {
  const { mutateAsync: deleteInteraction, isLoading: isDeleteLoading } = useDeleteInteraction(traineeId);
  const [error, setError] = useState<string>('');
  const [interactionToDelete, setInteractionToDelete] = React.useState<Interaction | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleClickOnDeleteButton = async (interaction: Interaction) => {
    setError('');
    setInteractionToDelete(interaction);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    onClickEdit(id);
  };

  const onConfirmDelete = async () => {
    if (!interactionToDelete) return;
    await deleteInteraction(interactionToDelete.id, {
      onSuccess: () => {
        setIsModalOpen(false);
        setInteractionToDelete(null);
      },
      onError: (error) => {
        if (error instanceof Error) setError(error.message);
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
            bgcolor: 'background.paper',
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
                <Box key={interaction.id}>
                  <ListItem
                    alignItems="flex-start"
                    disablePadding
                    sx={{
                      paddingBottom: 1,
                      bgcolor: index % 2 === 0 ? '#f8f9fa' : 'background.paper',
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
                      <AvatarWithTooltip imageUrl={interaction.reporter.imageUrl} name={interaction.reporter.name} />
                    </ListItemAvatar>
                    <ListItemText
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 1 }}>
                      <IconButton aria-label="edit" onClick={() => handleEdit(interaction.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleClickOnDeleteButton(interaction)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                </Box>
              );
            })
          )}
        </List>
      </Box>
    </React.Fragment>
  );
};

export default InteractionsList;
