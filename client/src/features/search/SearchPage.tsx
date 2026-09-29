import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import HYFLogo from '../../assets/hyf-logo-red.png';
import SearchBar from './components/SearchBar';
import SearchResultsList from './components/SearchResultsList';

/**
 * Component for displaying the home page / search page elements.
 */
const SearchPage = () => {
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    document.title = 'Home | Dojo';
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
        <SearchBar autoFocus onTextChange={setSearchString} sx={{ backgroundColor: 'background.dark' }} />
        {searchString && <SearchResultsList query={searchString} />}
      </Box>
    </Box>
  );
};

export default SearchPage;
