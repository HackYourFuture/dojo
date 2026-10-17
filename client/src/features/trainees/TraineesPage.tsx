import { Box, Button, Container, LinearProgress, Stack, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddTraineeDialog } from '../trainee-profile/create/AddTraineeDialog';
import CohortAccordion from './components/CohortAccordion';
import { ListLoader } from '../../components/ListLoader';
import { SuccessMessageSnackbar } from '../../components/SuccessMessageSnackbar';
import { TraineeFilterBar } from './components/TraineeFilterBar';
import { TraineeFilters } from './models/trainee-summary';
import { numberParam } from '../../data/listFilters';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetTraineesByCohort } from './data/trainees-queries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

/**
 * Component for displaying the trainees page, with the trainees grouped by cohort and filtered by the URL.
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

  const cohortsQuery = useGetTraineesByCohort({ ...filters, q });
  const { data, isPlaceholderData } = cohortsQuery;
  const isFiltered = searchParams.size > 0;

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">Trainees</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Trainee
          </Button>
        </Stack>
        <TraineeFilterBar filters={filters} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {data ? `${data.total} ${data.total === 1 ? 'trainee' : 'trainees'}` : '\u00a0'}
        </Typography>
        <LinearProgress sx={{ height: 2, mt: 0.5, mb: 1.5, visibility: isPlaceholderData ? 'visible' : 'hidden' }} />
        {data &&
          (data.cohorts.length > 0 ? (
            <Stack direction="column" spacing={2}>
              {/* A filtered list opens every cohort, the one without a cohort too, so no match stays hidden. */}
              {data.cohorts.map((cohort) => (
                <Box key={`${cohort.cohort ?? 'no-cohort'}-${isFiltered}`}>
                  <CohortAccordion cohortInfo={cohort} defaultExpanded={isFiltered || cohort.cohort !== null} />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              {isFiltered ? 'No trainees match these filters.' : 'No trainees yet.'}
            </Typography>
          ))}

        <ListLoader query={cohortsQuery} />
      </Box>
      <SuccessMessageSnackbar />
      <AddTraineeDialog isOpen={isAddDialogOpen} handleClose={() => setIsAddDialogOpen(false)} />
    </Container>
  );
};

export default TraineesPage;
