import { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { ErrorBox } from '../../components';
import HYFLogo from '../../assets/hyf-logo-red.png';
import SearchBar from './components/SearchBar';
import SearchResultsList from './components/SearchResultsList';
import { useSearch } from './data/queries';

/**
 * Component for displaying the home page / search page elements.
 */
const SearchPage = () => {
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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: '#333',
      }}
    >
      <Box
        sx={{
          paddingTop: '20vh',
          minWidth: '200px',
          width: '40%',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={HYFLogo}
          alt="HYF logo"
          sx={{
            height: '70px',
            padding: '10px',
            marginBottom: '50px',
          }}
        />
        <SearchBar onTextChange={handleTextChange} />
        {isError && error instanceof Error ? (
          <ErrorBox errorMessage={error.message} />
        ) : (
          searchString && <SearchResultsList isLoading={isLoading} data={data || []} />
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
