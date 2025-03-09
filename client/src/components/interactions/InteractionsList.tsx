import { Box, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Interaction, InteractionType } from '../../models/Interactions';

import AddNewInteractionComponent from './AddNewInteractionComponent';
import { AvatarWithTooltip } from '../shared/AvatarWithTooltip';
import React from 'react';
import { formatDateForDisplay } from '../../helpers/dateHelper';

interface InteractionsListProps {
  interactions: Interaction[];
}
const InteractionsList: React.FC<InteractionsListProps> = ({ interactions }) => {
  // coverts the interaction type to a user friendly string
  const getInteractionType = (type: InteractionType): string => {
    switch (type) {
      case InteractionType.CALL:
        return 'Call';
      case InteractionType.CHAT:
        return 'Chat';
      case InteractionType.FEEDBACK:
        return 'Feedback';
      case InteractionType.IN_PERSON:
        return 'In person';
      case InteractionType.TECH_HOUR:
        return 'Tech hour';
      case InteractionType.OTHER:
        return 'Other';
      default:
        return '';
    }
  };

  return (
    <Box padding="24px" width="65%" paddingRight={10}>
      <AddNewInteractionComponent />
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
                      alignIntems: 'center',
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
                          <Chip label={getInteractionType(interaction.type)} color="primary" size="small" />
                          <Typography>{interaction.title}</Typography>
                        </Box>
                        <Typography sx={{ paddingRight: 2 }}>{formatDateForDisplay(interaction.date)}</Typography>
                      </Box>
                    }
                    secondary={interaction.details}
                  />
                </ListItem>
              </Box>
            );
          })
        )}
      </List>
    </Box>
  );
};

export default InteractionsList;
