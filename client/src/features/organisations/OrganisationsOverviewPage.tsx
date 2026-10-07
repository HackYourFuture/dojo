import { Box, Button, Container, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddOrganisationDialog } from './components/AddOrganisationDialog';
import { ListLoader } from '../../components/ListLoader';
import { SuccessMessageSnackbar } from '../../components/SuccessMessageSnackbar';
import { OrganisationsTable } from './components/OrganisationsTable';
import { useGetOrganisations } from './data/organisation-queries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useState } from 'react';

/** The organisations page, with the organisations ordered by name. */
const OrganisationsOverviewPage = () => {
  usePageTitle('Organisations');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const organisationsQuery = useGetOrganisations();
  const { data: organisations } = organisationsQuery;

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Organisations</Typography>
        <Box sx={{ my: 2, py: 2, pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Organisation
          </Button>
        </Box>
        {organisations &&
          (organisations.length > 0 ? (
            <OrganisationsTable organisations={organisations} />
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>No organisations yet.</Typography>
          ))}

        <ListLoader query={organisationsQuery} />
      </Box>

      <SuccessMessageSnackbar />
      <AddOrganisationDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default OrganisationsOverviewPage;
