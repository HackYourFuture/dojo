import { Avatar, CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { ErrorBox } from '../../../components/ErrorBox';
import { Link } from 'react-router-dom';
import { SearchResult } from '../models/search-result';
import { useGetSearchResults } from '../data/search-queries';

interface SearchResultsListProps {
  query: string;
}

/**
 * Component for showing a list of trainee search results with links.
 *
 * @param {string} query the text to search for.
 * @returns {ReactNode} A React element that renders a list of matching trainee names list as a clickable link.
 */
const SearchResultsList = ({ query }: SearchResultsListProps) => {
  const { isLoading, data, error } = useGetSearchResults(query);

  if (error) {
    return <ErrorBox errorMessage={error.message} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: 300,
        bgcolor: 'background.paper',
        overflowY: 'scroll',
        boxShadow: '0px 0px 8px #ccc',
        borderRadius: '10px',
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={32} />
        </Box>
      ) : data?.length ? (
        <List>
          {data.map((result: SearchResult) => {
            return (
              <ListItem disablePadding key={result.id}>
                <Link
                  to={result.path}
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  <ListItemButton
                    key={result.id}
                    sx={{
                      color: 'text.primary',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar src={result.thumbnailUrl ?? ''} sx={{ width: 32, height: 32 }} variant="rounded"></Avatar>
                    </ListItemIcon>
                    <ListItemText primary={result.title}></ListItemText>
                    <ListItemText secondary={result.subtitle} sx={{ textAlign: 'right' }}></ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Alert severity="info" sx={{ bgcolor: 'background.paper' }}>
          No results found!
        </Alert>
      )}
    </Box>
  );
};

export default SearchResultsList;
