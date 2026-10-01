import { ErrorBox, Loader } from '../../components';

import { ActionsCard } from './components/ActionsCard';
import Box from '@mui/material/Box';
import CohortAccordion from './components/CohortAccordion';
import Container from '@mui/material/Container';
import { NextPageLoader } from '../../components/NextPageLoader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useGetTraineesByCohort } from './data/trainees-queries';

/**
 * Component for displaying the trainees page, with the trainees grouped by cohort.
 */
const TraineesPage = () => {
  useEffect(() => {
    document.title = 'Trainees | Dojo';
  }, []);

  const cohortsQuery = useGetTraineesByCohort();
  const { data: cohorts, error, isPending, isError, isFetchNextPageError } = cohortsQuery;

  const errorMessage = error?.message ?? 'An unknown error occurred while fetching trainees.';

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Trainees</Typography>
        <ActionsCard />
        {isPending && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Loader />
          </Box>
        )}
        {isError && !isFetchNextPageError && (
          <Box sx={{ width: '50%', margin: 'auto', marginTop: '2rem', marginBottom: '2rem' }}>
            <ErrorBox errorMessage={errorMessage} />
          </Box>
        )}

        <Stack direction="column" spacing={2}>
          {cohorts?.map((cohort) => (
            <Box key={cohort.cohort ?? 'no-cohort'}>
              <CohortAccordion cohortInfo={cohort}></CohortAccordion>
            </Box>
          ))}
        </Stack>

        <NextPageLoader query={cohortsQuery} />
      </Box>
    </Container>
  );
};

export default TraineesPage;
