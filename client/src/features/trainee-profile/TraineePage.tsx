import { ErrorBox, Loader } from '../../components';

import { Box } from '@mui/material';
import TraineeProfile from './profile/components/TraineeProfile';
import { TraineeProfileProvider } from './context/useTraineeProfileProvider';
import { useParams } from 'react-router-dom';
import { useTraineeInfoData } from './personal-info/data/useTraineeInfoData';

/**
 * Component for displaying the trainee profile page sidebar and tabs.
 */
const TraineePage = () => {
  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split('_');
  const traineeId = trainee ? trainee[1] : '';
  const { isLoading, data, isError, error, isFetching } = useTraineeInfoData(traineeId);

  // Show spinner only for the first load
  if ((isLoading || isFetching) && data === undefined) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return (
      <Box width="50%" margin="auto" marginTop="2rem">
        return <ErrorBox errorMessage={error.message} />;
      </Box>
    );
  }

  if (data) {
    return (
      <TraineeProfileProvider id={traineeId} originalTrainee={data}>
        <TraineeProfile id={traineeId} />
      </TraineeProfileProvider>
    );
  }
};

export default TraineePage;
