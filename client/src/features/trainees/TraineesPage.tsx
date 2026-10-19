import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Suspense, lazy, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { AddTraineeDialog } from '../trainee-profile/create/AddTraineeDialog';
import { Loader } from '../../components/Loader';
import { MapViewToggle } from './map/MapViewToggle';
import { SuccessMessageSnackbar } from '../../components/SuccessMessageSnackbar';
import { TraineeFilterBar } from './components/TraineeFilterBar';
import { TraineeFilters } from './models/trainee-summary';
import { TraineeList } from './components/TraineeList';
import { numberParam } from '../../data/listFilters';
import { useDebounce } from '../../hooks/useDebounce';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useSearchParams } from 'react-router';

// Leaflet and MapLibre are big, so they load only when the map is opened.
const TraineeMap = lazy(() => import('./map/TraineeMap'));

/**
 * Component for displaying the trainees page, with the trainees that match the filters in the URL as a list grouped by
 * cohort or on a map.
 */
const TraineesPage = () => {
  usePageTitle('Trainees');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const filters: TraineeFilters = {
    q: searchParams.get('q') ?? '',
    status: searchParams.getAll('status'),
    jobPath: searchParams.getAll('jobPath'),
    province: searchParams.getAll('province'),
    startCohort: numberParam(searchParams, 'startCohort'),
    endCohort: numberParam(searchParams, 'endCohort'),
  };
  // Searched once the typing stops, not at every key.
  const q = useDebounce(filters.q, 300);
  const isMap = searchParams.get('view') === 'map';

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4">Trainees</Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
            <MapViewToggle isMap={isMap} />
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
              Add Trainee
            </Button>
          </Stack>
        </Stack>
        <TraineeFilterBar filters={filters} />
        {isMap ? (
          <Suspense fallback={<Loader />}>
            <TraineeMap filters={{ ...filters, q }} />
          </Suspense>
        ) : (
          // The list has no view in the URL, so every parameter is a filter.
          <TraineeList filters={{ ...filters, q }} isFiltered={searchParams.size > 0} />
        )}
      </Box>
      <SuccessMessageSnackbar />
      <AddTraineeDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default TraineesPage;
