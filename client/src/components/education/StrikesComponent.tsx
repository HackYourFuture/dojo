import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddStrikeModal } from './AddStrikeModal';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Strike } from '../../models';
import { formatDate } from './EducationInfo';
import { useAddStrike } from '../../hooks/education/strike-queries';
import { useState } from 'react';

interface StrikesProps {
  traineeId: string;
  strikes: Strike[];
}

// TODO: Put traineeId in a context
export const StrikesComponent = ({ traineeId, strikes }: StrikesProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { mutate, isLoading, error } = useAddStrike(traineeId);

  // TODO: Add patching strike functionality when the API is ready.
  const handleAddStrike = async (strike: Strike) => {
    mutate(strike, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  /**
   * Function to enable adding strikes.
   */
  const handleOpenStrike = () => {
    setIsModalOpen(true);
  };

  /**
   * Function to cancel adding strikes.
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ width: '50%' }}>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="black" padding="16px">
          Strikes ({strikes.length || 0})
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button startIcon={<AddIcon />} onClick={handleOpenStrike}>
            New strike
          </Button>
        </Stack>
      </Box>

      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
      >
        {strikes.map((strike: Strike, index: number) => {
          return (
            <Box sx={{ backgroundColor: 'aliceblue' }} key={strike.id}>
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
        })}
      </List>

      <AddStrikeModal
        isLoading={isLoading}
        error={error instanceof Error ? error.message : ''}
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleAddStrike}
      />
    </div>
  );
};
