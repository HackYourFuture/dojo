import { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { DashboardPieChart, ErrorBox, Loader } from '../components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/nl';
import { Container, Stack, Box, Button } from '@mui/material';

/**
 * Component for displaying the dashboard page elements.
 *
 * @returns {ReactNode} A React element that renders date range to select and pie chart component.
 */
export const DashboardPage = () => {
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
    return <ErrorBox errorMessage={error.message} />;
  }

  return (
    <Container fixed>
      <Box my={3} display="flex" alignItems="start" justifyContent="start" p={2}>
        <Stack direction="row" spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
            <DatePicker
              label="Start date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="End date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
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
