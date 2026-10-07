import { ErrorBox, Loader } from '../../components';

import { Box } from '@mui/material';
import VolunteerProfile from './profile/VolunteerProfile';
import { useGetVolunteer } from './data/volunteer-queries';
import { useParams } from 'react-router';

/** The profile page of a volunteer. */
const VolunteerProfilePage = () => {
  // The name and the id of the volunteer, joined by an underscore. A bare id works too.
  const { volunteerInfo } = useParams();
  const volunteerId = volunteerInfo?.split('_').pop() ?? '';
  const { isLoading, data, isError, error, isFetching } = useGetVolunteer(volunteerId);

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
    // Keyed by volunteer, so going straight from one volunteer to another does not keep the previous one's state.
    return <VolunteerProfile key={volunteerId} volunteer={data} />;
  }
};

export default VolunteerProfilePage;
