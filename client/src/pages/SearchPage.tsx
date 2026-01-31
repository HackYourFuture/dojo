import { ErrorBox, SearchBar, SearchResultsList } from '../components';
import { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';
import HYFLogo from '../assets/hyf-logo-red.png';
import { useSearch } from '../data/search/queries';

/**
 * Component for displaying the home page / search page elements.
 */
export const SearchPage = () => {
  const [searchString, setSearchString] = useState('');
  /**
   * React Query hook to fetch matching trainees with a debounce time.
   */
  const { isLoading, data, isError, error } = useSearch(searchString);

  useEffect(() => {
    document.title = 'Home | Dojo';
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setSearchString(text);
  }, []);

  return (
    <div className="App">
      <div className="search-bar-container">
        <Box sx={{ display: 'flex' }}>
          <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img" />
        </Box>
        <SearchBar onTextChange={handleTextChange} />
        {isError && error instanceof Error ? (
          <ErrorBox errorMessage={error.message} />
        ) : (
          searchString && <SearchResultsList isLoading={isLoading} data={data || []} />
        )}
      </div>
    </div>
  );
};
