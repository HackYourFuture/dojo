import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import InteractionsList from './InteractionsList';
import { useGetInteractions } from '../../hooks/interactions/interaction-queries';
import { useTraineeProfileContext } from '../../hooks/useTraineeProfileContext';

export const InteractionsInfo = () => {
  const { traineeId } = useTraineeProfileContext();

  const { data: interactions, isLoading } = useGetInteractions(traineeId);

  return <Box>{isLoading ? <CircularProgress /> : <InteractionsList interactions={interactions || []} />}</Box>;
};
