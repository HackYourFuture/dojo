import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import CohortAccordion from './CohortAccordion';
import { ListLoader } from '../../../components/ListLoader';
import { TraineeFilters } from '../models/trainee-summary';
import { useGetTraineesByCohort } from '../data/trainees-queries';

interface TraineeListProps {
  filters: TraineeFilters;
  // Opens every cohort, so no match stays hidden.
  isFiltered: boolean;
}

/** The trainees that match the filters, grouped by cohort, loading the next page at the end of the list. */
export const TraineeList = ({ filters, isFiltered }: TraineeListProps) => {
  const cohortsQuery = useGetTraineesByCohort(filters);
  const { data, isPlaceholderData } = cohortsQuery;

  return (
    <>
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
    </>
  );
};
