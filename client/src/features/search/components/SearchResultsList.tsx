import { CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { SearchResult, SearchResultType } from '../models/search-result';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { ErrorBox } from '../../../components/ErrorBox';
import { Link } from 'react-router';
import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { PersonAvatar } from '../../../components/PersonAvatar';
import { useGetSearchResults } from '../data/search-queries';

interface SearchResultsListProps {
  query: string;
}

/** The search results for the query, each a link that opens its profile. */
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
                    {/* Keeps the v7 default width, so the space between avatar and name stays the same. */}
                    <ListItemIcon sx={{ minWidth: 56 }}>
                      {result.type === SearchResultType.Organisation ? (
                        <OrganisationLogo src={result.thumbnailUrl} name={result.title} size={32} />
                      ) : (
                        <PersonAvatar src={result.thumbnailUrl} name={result.title} size={32} />
                      )}
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
