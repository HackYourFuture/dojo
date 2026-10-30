import { Box, FormControlLabel, LinearProgress, Paper, Stack, Switch, TableContainer, Typography } from '@mui/material';
import CohortAccordion, { TraineesTable } from './CohortAccordion';

import { ListLoader } from '../../../components/ListLoader';
import { TraineeFilters } from '../models/trainee-summary';
import { useGetTraineesByCohort } from '../data/trainees-queries';
import { useState } from 'react';

interface TraineeListProps {
  filters: TraineeFilters;
  // Opens every cohort, so no match stays hidden, and turns the grouping off.
  isFiltered: boolean;
}

/** The trainees that match the filters, grouped by cohort or not, loading the next page at the end of the list. */
export const TraineeList = ({ filters, isFiltered }: TraineeListProps) => {
  const cohortsQuery = useGetTraineesByCohort(filters);
  const { data, isPlaceholderData } = cohortsQuery;
  // On by default, off once a filter is set, and on again when the filters are cleared.
  const [isGrouped, setIsGrouped] = useState(!isFiltered);
  const [wasFiltered, setWasFiltered] = useState(isFiltered);
  if (isFiltered !== wasFiltered) {
    setWasFiltered(isFiltered);
    setIsGrouped(!isFiltered);
  }

  return (
    <>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {data ? `${data.total} ${data.total === 1 ? 'trainee' : 'trainees'}` : '\u00a0'}
        </Typography>
        <FormControlLabel
          control={<Switch size="small" checked={isGrouped} onChange={(event) => setIsGrouped(event.target.checked)} />}
          label="Group by cohort"
          labelPlacement="start"
          slotProps={{ typography: { variant: 'body2' } }}
        />
      </Stack>
      <LinearProgress sx={{ height: 2, mt: 0.5, mb: 1.5, visibility: isPlaceholderData ? 'visible' : 'hidden' }} />
      {data &&
        (data.cohorts.length > 0 ? (
          isGrouped ? (
            <Stack direction="column" spacing={2}>
              {/* A filtered list opens every cohort, the one without a cohort too, so no match stays hidden. */}
              {data.cohorts.map((cohort) => (
                <Box key={`${cohort.cohort ?? 'no-cohort'}-${isFiltered}`}>
                  <CohortAccordion cohortInfo={cohort} defaultExpanded={isFiltered || cohort.cohort !== null} />
                </Box>
              ))}
            </Stack>
          ) : (
            <TableContainer component={Paper}>
              <TraineesTable trainees={data.cohorts.flatMap((cohort) => cohort.trainees)} showCohort />
            </TableContainer>
          )
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>
            {isFiltered ? 'No trainees match these filters.' : 'No trainees yet.'}
          </Typography>
        ))}

      <ListLoader query={cohortsQuery} />
    </>
  );
};
