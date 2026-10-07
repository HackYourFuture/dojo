import { Box, Button, Container, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddVolunteerDialog } from './components/AddVolunteerDialog';
import { ListLoader } from '../../components/ListLoader';
import { SuccessMessageSnackbar } from '../../components/SuccessMessageSnackbar';
import { VolunteersTable } from './components/VolunteersTable';
import { useGetVolunteers } from './data/volunteer-queries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useState } from 'react';

/** The volunteers page, with the volunteers ordered by first name. */
const VolunteersOverviewPage = () => {
  usePageTitle('Volunteers');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const volunteersQuery = useGetVolunteers();
  const { data: volunteers } = volunteersQuery;

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Volunteers</Typography>
        <Box sx={{ my: 2, py: 2, pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Volunteer
          </Button>
        </Box>
        {volunteers &&
          (volunteers.length > 0 ? (
            <VolunteersTable volunteers={volunteers} />
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>No volunteers yet.</Typography>
          ))}

        <ListLoader query={volunteersQuery} />
      </Box>

      <SuccessMessageSnackbar />
      <AddVolunteerDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default VolunteersOverviewPage;
