import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { daysFromToday, formatDateForDisplay } from '../../../data/dates';

import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import { Mentorship } from '../Mentorship';
import { MentorshipStatusChip } from './MentorshipStatusChip';
import { MentorshipTypeChip } from './MentorshipTypeChip';
import { PersonAvatar } from '../../../components/PersonAvatar';
import { Link as RouterLink } from 'react-router';
import { TraineeReference } from '../../../data/types/Trainee';
import { VolunteerReference } from '../../volunteers/Volunteer';

// Fit the longest content, with room for a fourth digit of days, so nothing wraps or moves. Names share the rest.
const COLUMNS = [
  { title: 'Type', width: 96 },
  { title: 'Mentor' },
  { title: 'Trainee' },
  { title: 'Status', width: 92 },
  { title: 'Period', width: 224 },
  { title: 'Check-ins', width: 268 },
];

// Ended mentorships stay readable, but step back.
const endedStyle = { opacity: 0.5 };

// An overdue next check-in: a red icon and the days it is late. Top-aligned, so the icon keeps the line height.
const overdueStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'top',
  gap: '1px',
  color: 'error.main',
  fontWeight: 500,
};

// Shown instead of a check-in date that is not set.
const NO_DATE = '---';

const days = (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`;

const formatDaysSince = (daysSince: number) => {
  if (daysSince === 0) {
    return 'today';
  }
  if (daysSince === 1) {
    return 'yesterday';
  }
  return `${days(daysSince)} ago`;
};

const formatDaysUntil = (daysUntil: number) => {
  if (daysUntil < 0) {
    return `overdue by ${days(-daysUntil)}`;
  }
  if (daysUntil === 0) {
    return 'today';
  }
  if (daysUntil === 1) {
    return 'tomorrow';
  }
  return `in ${days(daysUntil)}`;
};

interface CheckinsProps {
  mentorship: Mentorship;
}

// The last and the next check-in, each with its date, or --- when it has none, and how far it is from today.
const Checkins = ({ mentorship }: CheckinsProps) => {
  const { lastCheckinDate, nextCheckinDate, daysSinceLastCheckin, isEnded } = mentorship;
  // A next check-in only matters while the mentorship runs.
  const daysUntilNextCheckin = !isEnded && nextCheckinDate ? daysFromToday(nextCheckinDate) : null;
  const isOverdue = daysUntilNextCheckin !== null && daysUntilNextCheckin < 0;

  return (
    // A column each for the labels, the dates and how far they are, so the two lines line up.
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
        columnGap: 1,
        typography: 'body2',
        whiteSpace: 'nowrap',
      }}
    >
      <Box sx={{ fontWeight: 'bold' }}>Last:</Box>
      <Box>{lastCheckinDate ? formatDateForDisplay(lastCheckinDate) : NO_DATE}</Box>
      <Box sx={{ color: 'text.secondary' }}>
        {daysSinceLastCheckin !== null && formatDaysSince(daysSinceLastCheckin)}
      </Box>
      <Box sx={{ fontWeight: 'bold' }}>Next:</Box>
      <Box>{nextCheckinDate && daysUntilNextCheckin !== null ? formatDateForDisplay(nextCheckinDate) : NO_DATE}</Box>
      <Box sx={{ color: 'text.secondary' }}>
        {daysUntilNextCheckin !== null && !isOverdue && formatDaysUntil(daysUntilNextCheckin)}
        {isOverdue && (
          // Short, so it fits the column. The tooltip says it in full, and is the text screen readers read.
          <Tooltip title={formatDaysUntil(daysUntilNextCheckin)}>
            <Box component="span" sx={overdueStyle}>
              <AlarmRoundedIcon sx={{ fontSize: '1rem' }} />
              {-daysUntilNextCheckin}d
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

interface PersonLinkProps {
  person: VolunteerReference | TraineeReference;
}

// The picture and the name, which open the person's profile.
const PersonLink = ({ person }: PersonLinkProps) => (
  <Link
    component={RouterLink}
    to={person.profilePath}
    color="textPrimary"
    underline="hover"
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontWeight: 500, overflowWrap: 'anywhere' }}
  >
    <PersonAvatar src={person.thumbnailUrl} size={32} />
    {person.name}
  </Link>
);

interface MentorshipRowProps {
  mentorship: Mentorship;
}

const MentorshipRow = ({ mentorship }: MentorshipRowProps) => {
  const { isEnded } = mentorship;

  return (
    <TableRow sx={isEnded ? endedStyle : undefined}>
      <TableCell>
        <MentorshipTypeChip type={mentorship.type} />
      </TableCell>
      <TableCell>
        <PersonLink person={mentorship.volunteer} />
      </TableCell>
      <TableCell>
        <PersonLink person={mentorship.trainee} />
      </TableCell>
      <TableCell>
        <MentorshipStatusChip isEnded={isEnded} />
      </TableCell>
      <TableCell>
        {mentorship.endDate
          ? `${formatDateForDisplay(mentorship.startDate)} to ${formatDateForDisplay(mentorship.endDate)}`
          : `From ${formatDateForDisplay(mentorship.startDate)}`}
      </TableCell>
      <TableCell>
        <Checkins mentorship={mentorship} />
      </TableCell>
    </TableRow>
  );
};

interface MentorshipsTableProps {
  mentorships: Mentorship[];
}

/** The mentorships in a table, where the mentor and the trainee open their profiles. */
export const MentorshipsTable = ({ mentorships }: MentorshipsTableProps) => {
  return (
    // Scrolls sideways in a narrow window.
    <TableContainer component={Paper}>
      <Table size="small" aria-label="mentorships table" sx={{ tableLayout: 'fixed', minWidth: 1100 }}>
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell key={column.title} sx={{ width: column.width }}>
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& tr:last-child td': { border: 0 } }}>
          {mentorships.map((mentorship) => (
            <MentorshipRow key={mentorship.id} mentorship={mentorship} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
