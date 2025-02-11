import { ErrorBox, Loader, TraineeProfile } from '../components';

import { TraineeProfileProvider } from '../hooks/useTraineeProfileContext';
import { useParams } from 'react-router-dom';
import { useTraineeInfoData } from '../hooks';

/**
 * Component for displaying the trainee profile page sidebar and tabs.
 */
export const TraineePage = () => {
  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split('_');
  const traineeId = trainee ? trainee[1] : '';
  const { isLoading, data, isError, error, isFetching } = useTraineeInfoData(traineeId);

  // Show spinner only for the first load
  if ((isLoading || isFetching) && data === undefined) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return <ErrorBox errorMessage={error.message} />;
  }

  if (data) {
    return (
      <TraineeProfileProvider id={traineeId} originalTrainee={data}>
        <TraineeProfile id={traineeId} />
      </TraineeProfileProvider>
    );
  }
};
