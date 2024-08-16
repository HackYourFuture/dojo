import { SearchBar, SearchResultsList } from '../components';

import { Box } from '@mui/material';
import HYFLogo from '../assets/HYF_logo.svg';
import { useState } from 'react';

/**
 * Component for displaying the home page / search page elements.
 */
export const SearchPage = () => {
  const [searchString, setSearchString] = useState('');

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
        {searchString && <SearchResultsList searchString={searchString} />}
      </div>
    </div>
  );
};
