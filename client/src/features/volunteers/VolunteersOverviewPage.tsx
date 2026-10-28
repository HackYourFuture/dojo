import { Box, Button, Container, LinearProgress, Stack, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddVolunteerDialog } from './components/AddVolunteerDialog';
import { ListLoader } from '../../components/ListLoader';
import { SuccessMessageSnackbar } from '../../components/SuccessMessageSnackbar';
import { VolunteerFilterBar } from './components/VolunteerFilterBar';
import { VolunteerFilters } from './Volunteer';
import { VolunteersTable } from './components/VolunteersTable';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetVolunteers } from './data/volunteer-queries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

/** The volunteers page, with the volunteers ordered by first name and filtered by the URL. */
const VolunteersOverviewPage = () => {
  usePageTitle('Volunteers');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const filters: VolunteerFilters = {
    q: searchParams.get('q') ?? '',
    status: searchParams.getAll('status'),
    type: searchParams.getAll('type'),
    expertise: searchParams.getAll('expertise'),
    rolePreference: searchParams.getAll('rolePreference'),
    paired: searchParams.getAll('paired'),
  };
  // Searched once the typing stops, not at every key.
  const q = useDebounce(filters.q, 300);

  const volunteersQuery = useGetVolunteers({ ...filters, q });
  const { data, isPlaceholderData } = volunteersQuery;
  const isFiltered = searchParams.size > 0;

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">Volunteers</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Volunteer
          </Button>
        </Stack>
        <VolunteerFilterBar filters={filters} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {data ? `${data.total} ${data.total === 1 ? 'volunteer' : 'volunteers'}` : '\u00a0'}
        </Typography>
        <LinearProgress sx={{ height: 2, mt: 0.5, mb: 1.5, visibility: isPlaceholderData ? 'visible' : 'hidden' }} />
        {data &&
          (data.items.length > 0 ? (
            <VolunteersTable volunteers={data.items} />
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              {isFiltered ? 'No volunteers match these filters.' : 'No volunteers yet.'}
            </Typography>
          ))}

        <ListLoader query={volunteersQuery} />
      </Box>

      <SuccessMessageSnackbar />
      <AddVolunteerDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default VolunteersOverviewPage;
