import Container from '@mui/material/Container';
import { CohortAccordion, ErrorBox, Loader } from '../components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCohortsData } from '../hooks';
import { Cohort } from '../models';
import Stack from '@mui/material/Stack';

/**
 * Component for displaying the cohort page elements.
 */
export const CohortsPage = () => {
  const { isLoading, isError, data, error, isFetching } = useCohortsData();

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return <ErrorBox errorMessage={error.message} />;
  }

  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h3" gutterBottom>
          <b>Cohort Overview</b>
        </Typography>
        <Box display="flex" alignItems="start" justifyContent="start" p={2}>
          <Stack direction="column" spacing={2}>
            {data?.map((cohort: Cohort, index: number) => (
              <div key={index}>
                <CohortAccordion cohortInfo={cohort}></CohortAccordion>
              </div>
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};
