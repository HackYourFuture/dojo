import { ErrorBox, Loader } from '../../components';

import { Box } from '@mui/material';
import TraineeProfile from './profile/components/TraineeProfile';
import { TraineeProfileProvider } from './context/useTraineeProfileProvider';
import { useParams } from 'react-router';
import { useGetTrainee } from './data/trainee-queries';

/** The profile page of a trainee. */
const TraineePage = () => {
  // The name and the id of the trainee, joined by an underscore. A bare id works too.
  const { traineeInfo } = useParams();
  const traineeId = traineeInfo?.split('_').pop() ?? '';
  const { isLoading, data, isError, error, isFetching } = useGetTrainee(traineeId);

  // Show spinner only for the first load
  if ((isLoading || isFetching) && data === undefined) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return (
      <Box sx={{ width: '50%', margin: 'auto', marginTop: '2rem' }}>
        <ErrorBox errorMessage={error.message} />
      </Box>
    );
  }

  if (data) {
    return (
      // Keyed by trainee, so going straight from one trainee to another does not keep the previous one's state.
      <TraineeProfileProvider key={traineeId} id={traineeId} originalTrainee={data}>
        <TraineeProfile id={traineeId} />
      </TraineeProfileProvider>
    );
  }
};

export default TraineePage;
