import { Box, Button, CircularProgress } from '@mui/material';

import { ErrorBox } from './ErrorBox';
import { Loader } from './Loader';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface ListLoaderProps {
  // The list's query, from useInfiniteQuery.
  query: UseInfiniteQueryResult<unknown>;
}

/** The state of an endless list: the first load, then the next page when the end scrolls into view, and errors. */
export const ListLoader = ({ query }: ListLoaderProps) => {
  const {
    error,
    isPending,
    isError,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = query;
  const errorMessage = error?.message ?? 'An unknown error occurred while fetching the list.';

  // Loading a page cancels a running refetch of the loaded pages, so wait for it. After a failed page, wait for the
  // retry button, otherwise the end of the list, still in view, would request it again.
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetching && !isFetchNextPageError);

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box ref={loadMoreRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, paddingY: 2 }}>
      {/* The first page, or a reload of the loaded pages, failed. */}
      {isError && !isFetchNextPageError && <ErrorBox errorMessage={errorMessage} sx={{ width: '50%' }} />}
      {isFetchingNextPage && <CircularProgress />}
      {/* The error state lasts until a page loads, so it is hidden while the retry is running. */}
      {isFetchNextPageError && !isFetchingNextPage && (
        <>
          <ErrorBox errorMessage={errorMessage} />
          <Button onClick={() => fetchNextPage()}>Retry</Button>
        </>
      )}
    </Box>
  );
};
