import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Strike } from '../../models';
import { formatDate } from './EducationInfo';

interface StrikesListProps {
  strikes: Strike[];
}

export const StrikesList: React.FC<StrikesListProps> = ({ strikes }) => {
  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
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
                secondaryAction={formatDate(strike.date)}
                disablePadding
                sx={{
                  paddingBottom: '16px',
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <HighlightOffIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={strike.reason} secondary={strike.comments} />
              </ListItem>
              {index < strikes.length - 1 && <Divider sx={{ color: 'black' }} component="li" />}
            </Box>
          );
        })
      )}
    </List>
  );
};
