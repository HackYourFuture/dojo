import { Box, Button, Container, LinearProgress, Stack, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddOrganisationDialog } from './components/AddOrganisationDialog';
import { ListLoader } from '../../components/ListLoader';
import { OrganisationFilterBar } from './components/OrganisationFilterBar';
import { OrganisationFilters } from './Organisation';
import { OrganisationsTable } from './components/OrganisationsTable';
import { SuccessMessageSnackbar } from '../../components/SuccessMessageSnackbar';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetOrganisations } from './data/organisation-queries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

/** The organisations page, with the organisations ordered by name and filtered by the URL. */
const OrganisationsOverviewPage = () => {
  usePageTitle('Organisations');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const filters: OrganisationFilters = {
    q: searchParams.get('q') ?? '',
    status: searchParams.getAll('status'),
    responsibleId: searchParams.getAll('responsibleId'),
    partnership: searchParams.getAll('partnership'),
    province: searchParams.getAll('province'),
  };
  // Searched once the typing stops, not at every key.
  const q = useDebounce(filters.q, 300);

  const organisationsQuery = useGetOrganisations({ ...filters, q });
  const { data, isPlaceholderData } = organisationsQuery;
  const isFiltered = searchParams.size > 0;

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">Organisations</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Organisation
          </Button>
        </Stack>
        <OrganisationFilterBar filters={filters} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {data ? `${data.total} ${data.total === 1 ? 'organisation' : 'organisations'}` : '\u00a0'}
        </Typography>
        <LinearProgress sx={{ height: 2, mt: 0.5, mb: 1.5, visibility: isPlaceholderData ? 'visible' : 'hidden' }} />
        {data &&
          (data.items.length > 0 ? (
            <OrganisationsTable organisations={data.items} />
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              {isFiltered ? 'No organisations match these filters.' : 'No organisations yet.'}
            </Typography>
          ))}

        <ListLoader query={organisationsQuery} />
      </Box>

      <SuccessMessageSnackbar />
      <AddOrganisationDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default OrganisationsOverviewPage;
