import { ErrorBox, Loader } from '../../components';

import { Box } from '@mui/material';
import MentorshipProfile from './profile/MentorshipProfile';
import { useGetMentorship } from './data/mentorship-queries';
import { useParams } from 'react-router';

/** The profile page of a mentorship. */
const MentorshipProfilePage = () => {
  // Only the id: a mentorship has no name to put in its path.
  const { mentorshipId = '' } = useParams();
  const { isLoading, data, isError, error, isFetching } = useGetMentorship(mentorshipId);

  // Show spinner only for the first load
  if ((isLoading || isFetching) && data === undefined) {
    return <Loader />;
  }

  // Before the error, so a failed reload after a check-in change keeps the profile on screen.
  if (data) {
    // Keyed by mentorship, so going straight from one mentorship to another does not keep the previous one's state.
    return <MentorshipProfile key={mentorshipId} mentorship={data} />;
  }

  if (isError && error instanceof Error) {
    return (
      <Box sx={{ width: '50%', margin: 'auto', marginTop: '2rem' }}>
        <ErrorBox errorMessage={error.message} />
      </Box>
    );
  }
};

export default MentorshipProfilePage;
