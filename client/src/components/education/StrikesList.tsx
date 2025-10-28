import { Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import { AvatarWithTooltip } from '../shared/AvatarWithTooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Strike } from '../../models';
import { formatDateForDisplay } from '../../helpers/dateHelper';
import MarkdownText from '../shared/MarkdownText';

interface StrikesListProps { //NOTE: seems to hold strikes list
  strikes: Strike[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const StrikesList: React.FC<StrikesListProps> = ({ strikes, onClickEdit, onClickDelete }) => { //NOTE: so this is making sure that strikes list is a react functional component with strikeslist props
  /**
   * Formats the strike reason to a readable format
   * with the first letter capitalized
   * @param reason - The strike reason to format
   * @returns The formatted strike reason
   */
  const formatStrikeReason = (reason: string): string => {
    return reason.split('-').join(' ').charAt(0).toUpperCase() + reason.split('-').join(' ').slice(1).toLowerCase(); //NOTE: formatter for the comment
  };

  const handleEdit = (id: string) => { //NOTE: what to do for edit and delete which are on the side of each strike
    onClickEdit(id);
  };
  const handleDelete = (id: string) => {
    onClickDelete(id);
  };

  //NOTE: render how the actions look and these are two buttons that call either edit or delete.
  const renderActions = (id: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 1 }}>
        <IconButton aria-label="edit" onClick={() => handleEdit(id)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => handleDelete(id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  //NOTE: the return of the component I assume that here is where the const render actions will be also called.
  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        maxHeight: 300,
        overflow: 'auto',
        scrollbarWidth: 'thin',
      }}
    >
      {strikes.length === 0 ? ( //NOTE: add all found elements in the list or none
        <Typography variant="body1" color="#CCCCCC" padding="16px">
          No strikes found
        </Typography>
      ) : (
        strikes.map((strike: Strike, index: number) => {
          return ( //NOTE: the boxes are keyed so they are found again when needed
            <Box key={strike.id}>
              <ListItem
                alignItems="flex-start"
                disablePadding
                sx={{
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
                  <AvatarWithTooltip imageUrl={strike.reporter.imageUrl} name={strike.reporter.name} />
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
                      {formatStrikeReason(strike.reason || '')}
                      <Typography sx={{ paddingRight: 2 }}>{formatDateForDisplay(strike.date)}</Typography>
                    </Box>
                  }
                  secondary={<Box mt={-2}><MarkdownText>{strike.comments}</MarkdownText></Box>}
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
