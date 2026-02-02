import { Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { SearchResult } from '../Search';

interface SearchResultsListProps {
  isLoading: boolean;
  data: SearchResult[];
}

/**
 * Component for showing a list of trainee search results with links.
 *
 * @param {string} results search value.
 * @returns {ReactNode} A React element that renders a list of matching trainee names list as a clickable link.
 */
const SearchResultsList = ({ isLoading, data }: SearchResultsListProps) => {
  if (isLoading) {
    return <Loader />;
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
      {data?.length ? (
        <List>
          {data.map((trainee: SearchResult) => {
            return (
              <ListItem disablePadding key={trainee.id}>
                <Link
                  to={trainee.profilePath}
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  <ListItemButton
                    key={trainee.id}
                    sx={{
                      color: 'text.primary',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar src={trainee.thumbnail ?? ''} sx={{ width: 32, height: 32 }} variant="rounded"></Avatar>
                    </ListItemIcon>
                    <ListItemText primary={trainee.name}></ListItemText>
                    <ListItemText
                      secondary={trainee.cohort !== null ? `Cohort ${trainee.cohort}` : 'No cohort assigned'}
                      sx={{ textAlign: 'right' }}
                    ></ListItemText>
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
