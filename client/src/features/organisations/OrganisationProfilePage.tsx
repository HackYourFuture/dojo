import { ErrorBox, Loader } from '../../components';

import { Box } from '@mui/material';
import OrganisationProfile from './profile/OrganisationProfile';
import { useGetOrganisation } from './data/organisation-queries';
import { useParams } from 'react-router';

/** The profile page of an organisation. */
const OrganisationProfilePage = () => {
  // The name and the id of the organisation, joined by an underscore. A bare id works too.
  const { organisationInfo } = useParams();
  const organisationId = organisationInfo?.split('_').pop() ?? '';
  const { isLoading, data, isError, error, isFetching } = useGetOrganisation(organisationId);

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
    // Keyed by organisation, so going straight from one organisation to another does not keep the previous one's state.
    return <OrganisationProfile key={organisationId} organisation={data} />;
  }
};

export default OrganisationProfilePage;
