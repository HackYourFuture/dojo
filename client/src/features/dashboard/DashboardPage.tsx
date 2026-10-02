import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { ErrorBox, Loader } from '../../components';
import { NumberField } from '../../components/NumberField';
import { useEffect, useState } from 'react';
import { DashboardCard } from './components/DashboardCard';
import { DashboardSection } from './components/DashboardSection';
import { DistributionBarChart } from './components/DistributionBarChart';
import { DistributionPieChart } from './components/DistributionPieChart';
import { LearningStatusChart } from './components/LearningStatusChart';
import { SplitBar } from './components/SplitBar';
import { StatCard } from './components/StatCard';
import { useGetDashboard } from './data/dashboard-queries';

const DashboardPage = () => {
  useEffect(() => {
    document.title = 'Dashboard | Dojo';
  }, []);

  // An empty field means no bound.
  const [startCohort, setStartCohort] = useState<number | null>(null);
  const [endCohort, setEndCohort] = useState<number | null>(null);
  const { data, isPending, isError, error } = useGetDashboard(startCohort, endCohort);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
      <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 3, mb: 2, flexWrap: 'wrap' }}>
        <NumberField
          id="startCohort"
          label="From cohort"
          value={startCohort}
          placeholder="0"
          onValueChange={setStartCohort}
          sx={{ width: 130 }}
        />
        <NumberField
          id="endCohort"
          label="To cohort"
          value={endCohort}
          placeholder="current"
          onValueChange={setEndCohort}
          sx={{ width: 130 }}
        />
      </Stack>

      {isPending && <Loader />}
      {isError && (
        <Box sx={{ width: '50%', margin: 'auto' }}>
          <ErrorBox errorMessage={error.message} />
        </Box>
      )}
      {data && (
        <Stack spacing={4}>
          <DashboardSection title="Overview">
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Active trainees"
                info="Trainees studying or on hold, plus graduates whose job path is searching."
                value={data.overview.active}
              >
                {/* The same colors as the learning status chart. */}
                <SplitBar
                  parts={[
                    { label: 'studying', value: data.overview.studying, color: 'info.main' },
                    { label: 'on hold', value: data.overview.onHold, color: 'warning.main' },
                    { label: 'looking for a job', value: data.overview.searching, color: 'success.main' },
                  ]}
                />
              </StatCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Working in IT"
                info="Graduates whose job path is internship or tech job."
                value={data.overview.workingInIt}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Left without IT job"
                info="Trainees who quit, plus graduates who are neither working in IT nor looking for a job."
                value={data.overview.leftWithoutItJob}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Total trainees" value={data.overview.total} />
            </Grid>
          </DashboardSection>

          <DashboardSection title="Education">
            <Grid size={{ xs: 12, md: 6 }}>
              <DashboardCard title="Learning status">
                <LearningStatusChart rows={data.learningStatuses} />
              </DashboardCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DashboardCard title="Education level">
                <DistributionPieChart rows={data.educationLevels} />
              </DashboardCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DashboardCard title="Track">
                <DistributionBarChart rows={data.tracks} layout="vertical" />
              </DashboardCard>
            </Grid>
          </DashboardSection>

          <DashboardSection title="Demographics">
            <Grid size={{ xs: 12, md: 7 }}>
              <DashboardCard title="Country of origin">
                <DistributionBarChart rows={data.countries} layout="horizontal" />
              </DashboardCard>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <DashboardCard title="Gender">
                <DistributionPieChart rows={data.genders} />
              </DashboardCard>
            </Grid>
          </DashboardSection>
        </Stack>
      )}
    </Container>
  );
};

export default DashboardPage;
