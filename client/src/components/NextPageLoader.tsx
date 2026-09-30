import { Box, Button, CircularProgress } from '@mui/material';

import { ErrorBox } from './ErrorBox';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface NextPageLoaderProps {
  // The list's query, from useInfiniteQuery.
  query: UseInfiniteQueryResult<unknown>;
}

/** The end of an endless list, which loads the next page when it scrolls into view and offers a retry when that fails. */
export const NextPageLoader = ({ query }: NextPageLoaderProps) => {
  const { error, hasNextPage, isFetching, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = query;

  // Loading a page cancels a running refetch of the loaded pages, so wait for it. After a failed page, wait for the
  // retry button, otherwise the end of the list, still in view, would request it again.
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetching && !isFetchNextPageError);

  return (
    <Box ref={loadMoreRef} display="flex" flexDirection="column" alignItems="center" gap={1} paddingY={2}>
      {isFetchingNextPage && <CircularProgress />}
      {/* The error state lasts until a page loads, so it is hidden while the retry is running. */}
      {isFetchNextPageError && !isFetchingNextPage && (
        <>
          <ErrorBox errorMessage={error?.message ?? 'An unknown error occurred while fetching the next page.'} />
          <Button onClick={() => fetchNextPage()}>Retry</Button>
        </>
      )}
    </Box>
  );
};
