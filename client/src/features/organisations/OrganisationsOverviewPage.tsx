import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { ErrorBox, Loader } from '../../components';
import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { AddOrganisationDialog } from './components/AddOrganisationDialog';
import { OrganisationsTable } from './components/OrganisationsTable';
import { useGetOrganisations } from './data/organisation-queries';
import { useInfiniteScroll } from '../trainees/hooks/useInfiniteScroll';

/** The organisations page, with the organisations ordered by name. */
const OrganisationsOverviewPage = () => {
  useEffect(() => {
    document.title = 'Organisations | Dojo';
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: organisations,
    error,
    isPending,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useGetOrganisations();

  const errorMessage = error?.message ?? 'An unknown error occurred while fetching organisations.';

  // Loading a page cancels a running refetch of the loaded pages, so wait for it. After a failed page, wait for the
  // retry button, otherwise the end of the list, still in view, would request it again.
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetching && !isFetchNextPageError);

  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h4">Organisations</Typography>
        <Box sx={{ my: 2, py: 2, pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Organisation
          </Button>
        </Box>
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

        {organisations &&
          (organisations.length > 0 ? (
            <OrganisationsTable organisations={organisations} />
          ) : (
            <Typography color="text.secondary">No organisations yet.</Typography>
          ))}

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

      <AddOrganisationDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default OrganisationsOverviewPage;
