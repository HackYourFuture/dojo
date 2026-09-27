import { Button, CircularProgress } from '@mui/material';
import { ErrorBox, Loader } from '../../components';

import { ActionsCard } from './components/ActionsCard';
import Box from '@mui/material/Box';
import CohortAccordion from './components/CohortAccordion';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useGetTraineesByCohort } from './data/trainees-queries';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

/**
 * Component for displaying the trainees page, with the trainees grouped by cohort.
 */
const TraineesPage = () => {
  useEffect(() => {
    document.title = 'Trainees | Dojo';
  }, []);

  const {
    data: cohorts,
    error,
    isPending,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useGetTraineesByCohort();

  const errorMessage = error?.message ?? 'An unknown error occurred while fetching trainees.';

  // Loading a page cancels a running refetch of the loaded pages, so wait for it. After a failed page, wait for the
  // retry button, otherwise the end of the list, still in view, would request it again.
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetching && !isFetchNextPageError);

  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h4">Trainees</Typography>
        <ActionsCard />
        {isPending && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Loader />
          </Box>
        )}
        {isError && !isFetchNextPageError && (
          <Box width="50%" margin="auto" marginTop="2rem" marginBottom="2rem">
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

        <Box ref={loadMoreRef} display="flex" flexDirection="column" alignItems="center" gap={1} paddingY={2}>
          {isFetchingNextPage && <CircularProgress />}
          {/* The error state lasts until a page loads, so it is hidden while the retry is running. */}
          {isFetchNextPageError && !isFetchingNextPage && (
            <>
              <ErrorBox errorMessage={errorMessage} />
              <Button onClick={() => fetchNextPage()}>Retry</Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default TraineesPage;
