import { Box, Button, Container, Stack } from '@mui/material';
import { DashboardPieChart, ErrorBox, Loader } from '../../components';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetDashboard } from './data/dashboard-queries';

/**
 * Component for displaying the dashboard page elements.
 *
 * @returns {ReactNode} A React element that renders date range to select and pie chart component.
 */
const DashboardPage = () => {
  useEffect(() => {
    document.title = 'Dashboard | Dojo';
  }, []);

  const today = new Date();
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(today));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(today));

  const startDateFormatted: string | undefined = startDate?.format('YYYY-MM-DD');
  const endDateFormatted: string | undefined = endDate?.format('YYYY-MM-DD');

  const { isLoading, isError, data, error, isFetching, refetch } = useGetDashboard(
    startDateFormatted,
    endDateFormatted
  );

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return (
      <Box sx={{ width: '50%', margin: 'auto', marginTop: '2rem' }}>
        <ErrorBox errorMessage={error.message} />;
      </Box>
    );
  }

  return (
    <Container fixed sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ my: 3, display: 'flex', alignItems: 'start', justifyContent: 'start', p: 2 }}>
        <Stack direction="row" spacing={3}>
          <DatePicker label="Start date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
          <DatePicker label="End date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
          <Button variant="contained" onClick={() => refetch()}>
            Apply
          </Button>
        </Stack>
      </Box>
      {data && <DashboardPieChart chartData={data} />}
    </Container>
  );
};

export default DashboardPage;
