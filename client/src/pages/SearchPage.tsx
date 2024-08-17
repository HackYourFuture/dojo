import { SearchBar, SearchResultsList } from '../components';

import { Box } from '@mui/material';
import HYFLogo from '../assets/HYF_logo.svg';
import { useState } from 'react';
import { useTraineeSearchData } from '../hooks/useTraineeSearchData';

/**
 * Component for displaying the home page / search page elements.
 */
export const SearchPage = () => {
  const [searchString, setSearchString] = useState('');
  /**
   * React Query hook to fetch matching trainees with a debounce time.
   */
  const { isLoading, data, isError, error, isFetching } = useTraineeSearchData(searchString);

  function handleTextChange(text: string) {
    setSearchString(text);
  }

  return (
    <div className="App">
      <div className="search-bar-container">
        <Box sx={{ display: 'flex' }}>
          <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img" />
        </Box>
        <SearchBar onTextChange={(text) => handleTextChange(text)} />
        {searchString && (
          <SearchResultsList
            searchString={searchString}
            isLoading={isLoading && isFetching}
            data={data || []}
            isError={isError}
            error={error}
          />
        )}
      </div>
    </div>
  );
};
