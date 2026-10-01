import { Box, Button, Container, Typography } from '@mui/material';
import { ErrorBox, Loader } from '../../components';
import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { AddOrganisationDialog } from './components/AddOrganisationDialog';
import { NextPageLoader } from '../../components/NextPageLoader';
import { OrganisationsTable } from './components/OrganisationsTable';
import { useGetOrganisations } from './data/organisation-queries';

/** The organisations page, with the organisations ordered by name. */
const OrganisationsOverviewPage = () => {
  useEffect(() => {
    document.title = 'Organisations | Dojo';
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const organisationsQuery = useGetOrganisations();
  const { data: organisations, error, isPending, isError, isFetchNextPageError } = organisationsQuery;

  const errorMessage = error?.message ?? 'An unknown error occurred while fetching organisations.';

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Organisations</Typography>
        <Box sx={{ my: 2, py: 2, pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Organisation
          </Button>
        </Box>
        {isPending && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Loader />
          </Box>
        )}
        {isError && !isFetchNextPageError && (
          <Box sx={{ width: '50%', margin: 'auto', marginTop: '2rem', marginBottom: '2rem' }}>
            <ErrorBox errorMessage={errorMessage} />
          </Box>
        )}

        {organisations &&
          (organisations.length > 0 ? (
            <OrganisationsTable organisations={organisations} />
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>No organisations yet.</Typography>
          ))}

        <NextPageLoader query={organisationsQuery} />
      </Box>

      <AddOrganisationDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default OrganisationsOverviewPage;
