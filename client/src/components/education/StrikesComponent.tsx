import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useAddStrike, useGetStrikes } from '../../hooks/education/strike-queries';

import AddIcon from '@mui/icons-material/Add';
import { AddStrikeModal } from './AddStrikeModal';
import { Loader } from '../Loader';
import { Strike } from '../../models';
import { StrikesList } from './StrikesList';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../hooks/traineeProfileContext';

export const StrikesComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { traineeId } = useTraineeProfileContext();

  const { mutate, isLoading, error } = useAddStrike(traineeId || '');

  const { data: strikes, isLoading: strikesLoading, error: strikesError } = useGetStrikes(traineeId || '');

  const queryClient = useQueryClient();

  const handleAddStrike = async (strike: Strike) => {
    mutate(strike, {
      onSuccess: () => {
        setIsModalOpen(false);
        // Refetch strikes after adding a new strike
        queryClient.invalidateQueries(['strikes', traineeId]);
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
          Strikes ({strikes?.length || 0})
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button startIcon={<AddIcon />} onClick={handleOpenStrike}>
            New strike
          </Button>
        </Stack>
      </Box>

      {strikesError ? (
        <Alert severity="error">
          Oopsie! Something went wrong: {(strikesError as Error)?.message || 'Unknown error'}
        </Alert>
      ) : strikesLoading ? (
        <Box height="200px">
          <Loader />
        </Box>
      ) : (
        <StrikesList strikes={strikes || []} />
      )}
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
