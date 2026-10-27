import { formatDateForDisplay } from '../../../data/dates';

// Like "01-09-2026 to 01-12-2026", or "From 01-09-2026" while the mentorship has no end date.
export const formatPeriod = (startDate: Date, endDate: Date | null) =>
  endDate
    ? `${formatDateForDisplay(startDate)} to ${formatDateForDisplay(endDate)}`
    : `From ${formatDateForDisplay(startDate)}`;
