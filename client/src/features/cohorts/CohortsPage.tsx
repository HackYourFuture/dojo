import { ActionsCard } from './components/ActionsCard';
import Box from '@mui/material/Box';
import { Cohort } from '../cohorts/Cohorts';
import CohortAccordion from './components/CohortAccordion';
import Container from '@mui/material/Container';
import { Loader } from '../../components';
import Stack from '@mui/material/Stack';
import { StyledErrorBox } from '../../components/StyledErrorBox';
import Typography from '@mui/material/Typography';
import { useCohortsData } from './data/useCohortsData';
import { useEffect } from 'react';

/**
 * Component for displaying the cohort page elements.
 */
const CohortsPage = () => {
  useEffect(() => {
    document.title = 'Cohorts | Dojo';
  }, []);

  const { isError, data, error, isPending } = useCohortsData();

  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h4">Cohorts Overview</Typography>
        <ActionsCard />
        {isPending && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Loader />
          </Box>
        )}
        {isError && (
          <StyledErrorBox
            message={error instanceof Error ? error.message : 'An unknown error occurred while fetching cohorts data.'}
          />
        )}

        <Stack direction="column" spacing={2}>
          {data?.sort(compareCohort).map((cohort: Cohort, index: number) => (
            <Box key={index}>
              <CohortAccordion cohortInfo={cohort}></CohortAccordion>
            </Box>
          ))}
        </Stack>
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
