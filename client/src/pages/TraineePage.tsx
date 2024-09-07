import { useParams } from 'react-router-dom';
import { useTraineeInfoData } from '../hooks';
import { ErrorBox, Loader, TraineeProfile } from '../components';

/**
 * Component for displaying the trainee profile page sidebar and tabs.
 */
export const TraineePage = () => {
  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split('_');
  const traineeId = trainee ? trainee[1] : '';
  const { isLoading, isError, error, isFetching } = useTraineeInfoData(traineeId);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return <ErrorBox errorMessage={error.message} />;
  }

  return <TraineeProfile id={traineeId} />;
};
