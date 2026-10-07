import { ActionsCard } from './components/ActionsCard';
import Box from '@mui/material/Box';
import CohortAccordion from './components/CohortAccordion';
import Container from '@mui/material/Container';
import { ListLoader } from '../../components/ListLoader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useGetTraineesByCohort } from './data/trainees-queries';
import { usePageTitle } from '../../hooks/usePageTitle';

/**
 * Component for displaying the trainees page, with the trainees grouped by cohort.
 */
const TraineesPage = () => {
  usePageTitle('Trainees');

  const cohortsQuery = useGetTraineesByCohort();
  const { data: cohorts } = cohortsQuery;

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Trainees</Typography>
        <ActionsCard />
        <Stack direction="column" spacing={2}>
          {cohorts?.map((cohort) => (
            <Box key={cohort.cohort ?? 'no-cohort'}>
              <CohortAccordion cohortInfo={cohort}></CohortAccordion>
            </Box>
          ))}
        </Stack>

        <ListLoader query={cohortsQuery} />
      </Box>
    </Container>
  );
};

export default TraineesPage;
