import { Button, CircularProgress } from '@mui/material';
import { ErrorBox, Loader } from '../../components';

import { ActionsCard } from './components/ActionsCard';
import Box from '@mui/material/Box';
import CohortAccordion from './components/CohortAccordion';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useGetCohorts } from './data/cohort-queries';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

/**
 * Component for displaying the cohort page elements.
 */
const CohortsPage = () => {
  useEffect(() => {
    document.title = 'Cohorts | Dojo';
  }, []);

  const {
    data: cohorts,
    error,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useGetCohorts();

  // After a failed page, wait for the retry button. Otherwise the end of the list, still in view, requests it again.
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage && !isFetchNextPageError);

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
        {isError && !isFetchNextPageError && (
          <Box width="50%" margin="auto" marginTop="2rem" marginBottom="2rem">
            <ErrorBox
              errorMessage={
                error instanceof Error ? error.message : 'An unknown error occurred while fetching cohorts data.'
              }
            />
          </Box>
        )}

        <Stack direction="column" spacing={2}>
          {cohorts?.map((cohort) => (
            <Box key={cohort.cohort ?? 'no-cohort'}>
              <CohortAccordion cohortInfo={cohort}></CohortAccordion>
            </Box>
          ))}
        </Stack>

        <Box ref={loadMoreRef} display="flex" flexDirection="column" alignItems="center" gap={1} paddingY={2}>
          {isFetchingNextPage && <CircularProgress />}
          {isFetchNextPageError && (
            <>
              <ErrorBox errorMessage={error?.message ?? 'An unknown error occurred while fetching cohorts data.'} />
              <Button onClick={() => fetchNextPage()}>Retry</Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CohortsPage;
