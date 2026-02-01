import 'dayjs/locale/nl';

import { Box, Button, Container, Stack } from '@mui/material';
import { DashboardPieChart, ErrorBox, Loader } from '../../components';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDashboardData } from './data/useDashboardData';

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

  const { isLoading, isError, data, error, isFetching, refetch } = useDashboardData(
    startDateFormatted,
    endDateFormatted
  );

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    <Box width="50%" margin="auto" marginTop="2rem">
      return <ErrorBox errorMessage={error.message} />;
    </Box>;
    return <ErrorBox errorMessage={error.message} />;
  }

  return (
    <Container fixed>
      <Box my={3} display="flex" alignItems="start" justifyContent="start" p={2}>
        <Stack direction="row" spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
            <DatePicker label="Start date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
            <DatePicker label="End date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
          </LocalizationProvider>
          <Button variant="contained" onClick={() => refetch()}>
            Apply
          </Button>
        </Stack>
      </Box>
      {data && <DashboardPieChart chartData={data}></DashboardPieChart>}
    </Container>
  );
};

export default DashboardPage;
