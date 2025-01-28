import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Strike } from '../../models';
import { formatDate } from './EducationInfo';

interface StrikesListProps {
  strikes: Strike[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const StrikesList: React.FC<StrikesListProps> = ({ strikes, onClickEdit, onClickDelete }) => {
  const handleEdit = (id: string) => {
    onClickEdit(id);
  };
  const handleDelete = (id: string) => {
    onClickDelete(id);
  };

  const renderActions = (date: Date, id: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 1 }}>
        <Typography sx={{ paddingRight: 2 }}>{formatDate(date)}</Typography>
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
        bgcolor: 'background.paper',
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
                  paddingBottom: '16px',
                  bgcolor: index % 2 === 0 ? '#f8f9fa' : 'background.paper',
                }}
              >
                <ListItemAvatar>
                  <Tooltip title={strike.reporter.name} placement="top">
                    <Avatar src={strike.reporter.imageUrl}>
                      <HighlightOffIcon />
                    </Avatar>
                  </Tooltip>
                </ListItemAvatar>
                <ListItemText primary={strike.reason} secondary={strike.comments} />
                {renderActions(strike.date, strike.id)}
              </ListItem>
            </Box>
          );
        })
      )}
    </List>
  );
};
