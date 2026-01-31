import { ErrorBox, Loader } from '../components';

import Box from '@mui/material/Box';
import { Cohort } from '../models';
import { CohortAccordion } from '../components';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCohortsData } from '../hooks';
import { useEffect } from 'react';

/**
 * Component for displaying the cohort page elements.
 */
const CohortsPage = () => {
  useEffect(() => {
    document.title = 'Cohorts | Dojo';
  }, []);

  const { isLoading, isError, data, error, isFetching } = useCohortsData();

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return (
      //fixme: make this reusable
      <Box width="50%" margin="auto" marginTop="2rem">
        return <ErrorBox errorMessage={error.message} />;
      </Box>
    );
  }

  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h4">Cohorts Overview</Typography>
        <Box display="flex" alignItems="start" justifyContent="start" p={2}>
          <Stack direction="column" spacing={2}>
            {data?.sort(compareCohort).map((cohort: Cohort, index: number) => (
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

const compareCohort = (a: Cohort, b: Cohort) => {
  // Sort by cohort number, descending. Put cohorts with no number on the top.
  const cohortA = a.cohort ?? Number.MAX_SAFE_INTEGER;
  const cohortB = b.cohort ?? Number.MAX_SAFE_INTEGER;
  return cohortB - cohortA;
};

export default CohortsPage;
