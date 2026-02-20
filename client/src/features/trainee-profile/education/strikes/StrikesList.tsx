import { Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import { AvatarWithTooltip } from '../components/AvatarWithTooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MarkdownText from '../../components/MarkdownText';
import { Strike } from '../../../../data/types/Trainee';
import { formatDateForDisplay } from '../../utils/dateHelper';
import React from 'react';

interface StrikesListProps {
  strikes: Strike[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const StrikesList: React.FC<StrikesListProps> = ({ strikes, onClickEdit, onClickDelete }) => {
  /**
   * Formats the strike reason to a readable format
   * with the first letter capitalized
   * @param reason - The strike reason to format
   * @returns The formatted strike reason
   */
  const formatStrikeReason = (reason: string): string => {
    return reason.split('-').join(' ').charAt(0).toUpperCase() + reason.split('-').join(' ').slice(1).toLowerCase();
  };

  const handleEdit = (id: string) => {
    onClickEdit(id);
  };
  const handleDelete = (id: string) => {
    onClickDelete(id);
  };

  const renderActions = (id: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 1 }}>
        <IconButton aria-label="edit" onClick={() => handleEdit(id)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => handleDelete(id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <List
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        maxHeight: 300,
        overflow: 'auto',
        scrollbarWidth: 'thin',
      }}
    >
      {strikes.length === 0 ? (
        <Typography variant="body1" color="#CCCCCC" padding="16px">
          No strikes found
        </Typography>
      ) : (
        strikes.map((strike: Strike, index: number) => {
          return (
            <Box key={strike.id}>
              <ListItem
                alignItems="flex-start"
                disablePadding
                sx={{
                  backgroundColor: index % 2 === 0 ? 'background.paperAlt' : 'background.paper',
                }}
              >
                <ListItemAvatar
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    pt: 1,
                  }}
                >
                  <AvatarWithTooltip imageUrl={strike.reporter.imageUrl} name={strike.reporter.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                      py={1}
                    >
                      {formatStrikeReason(strike.reason || '')}
                      <Typography sx={{ pr: 2 }}>{formatDateForDisplay(strike.date)}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box mt={-2}>
                      <MarkdownText>{strike.comments}</MarkdownText>
                    </Box>
                  }
                />
                {renderActions(strike.id)}
              </ListItem>
            </Box>
          );
        })
      )}
    </List>
  );
};
