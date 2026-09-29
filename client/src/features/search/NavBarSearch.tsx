import { Box, ClickAwayListener } from '@mui/material';

import SearchBar from './components/SearchBar';
import SearchResultsList from './components/SearchResultsList';
import { useState } from 'react';

/** The search box in the nav bar, with the same results as the search page in a dropdown below it. */
export const NavBarSearch = () => {
  const [searchString, setSearchString] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Focusing or typing in the search box shows the results, Escape and clicking elsewhere close them.
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ClickAwayListener onClickAway={close}>
      <Box
        // Narrower on small screens to leave room for the logo.
        sx={{ position: 'relative', width: 375, maxWidth: { xs: '40vw', sm: '50vw' } }}
        onFocus={open}
        onChange={open}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            close();
          }
        }}
      >
        <SearchBar
          size="small"
          onTextChange={setSearchString}
          sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
        />
        {isOpen && searchString && (
          // As wide as the search box, and as wide as the page on a phone.
          <Box sx={{ position: 'absolute', top: '100%', right: 0, width: { xs: 'calc(100vw - 32px)', sm: 1 }, mt: 1 }}>
            <SearchResultsList query={searchString} />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};
