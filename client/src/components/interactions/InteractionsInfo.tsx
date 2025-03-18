import AddNewInteractionComponent from './AddNewInteractionComponent';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import InteractionsList from './InteractionsList';
import { useGetInteractions } from '../../hooks/interactions/interaction-queries';
import { useTraineeProfileContext } from '../../hooks/useTraineeProfileContext';

export const InteractionsInfo = () => {
  const { traineeId } = useTraineeProfileContext();

  const { data: interactions, isLoading } = useGetInteractions(traineeId);

  return (
    <Box padding="24px" width="65%" paddingRight={10}>
      {isLoading ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <AddNewInteractionComponent traineeId={traineeId} />
          <InteractionsList traineeId={traineeId} interactions={interactions || []} />
        </>
      )}
    </Box>
  );
};
