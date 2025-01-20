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
import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { AddStrikeModal } from './AddStrikeModal';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Strike } from '../../models';
import { formatDate } from './EducationInfo';

interface StrikesProps {
  strikes: Strike[];
}
export const StrikesComponent = ({ strikes }: StrikesProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // TODO: Add patching strike functionality when the API is ready.
  const handleAddStrike = async (strike: Strike) => {
    console.log('hi, i want to add the followig strike: ', strike);
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
          console.log(strike);
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

      <AddStrikeModal open={isModalOpen} onClose={closeModal} onConfirm={handleAddStrike} />
    </div>
  );
};
