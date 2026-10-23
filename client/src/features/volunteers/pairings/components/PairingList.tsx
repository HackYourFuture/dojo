import { Box, Button, Link, List, ListItem, ListItemAvatar, Stack, Tooltip, Typography } from '@mui/material';
import { MentorPairing, isOngoing } from '../MentorPairing';
import { daysFromToday, formatDateForDisplay } from '../../../../data/dates';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { ListItemActions } from '../../../../components/ListItemActions';
import { MentorPairingTypeChip } from './MentorPairingTypeChip';
import { PersonAvatar } from '../../../../components/PersonAvatar';
import { Link as RouterLink } from 'react-router';

const listStyle = {
  width: '100%',
  bgcolor: 'background.paper',
  '& > :nth-of-type(odd)': { bgcolor: 'background.paperAlt' },
};

// Ended pairings stay readable, but step back behind the ongoing ones.
const endedStyle = { opacity: 0.6 };

const days = (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`;

// When the pairing ran, or since when it runs.
const formatPeriod = ({ startDate, endDate }: MentorPairing) => {
  if (endDate) {
    return `${formatDateForDisplay(startDate)} – ${formatDateForDisplay(endDate)}`;
  }
  return `${daysFromToday(startDate) > 0 ? 'Starts' : 'Since'} ${formatDateForDisplay(startDate)}`;
};

const formatLastCheckin = (daysSinceLastCheckin: number) => {
  if (daysSinceLastCheckin === 0) {
    return 'Last check-in today';
  }
  if (daysSinceLastCheckin === 1) {
    return 'Last check-in yesterday';
  }
  return `Last check-in ${days(daysSinceLastCheckin)} ago`;
};

const formatNextCheckin = (daysUntil: number) => {
  if (daysUntil < 0) {
    return `Next check-in overdue by ${days(-daysUntil)}`;
  }
  if (daysUntil === 0) {
    return 'Next check-in today';
  }
  if (daysUntil === 1) {
    return 'Next check-in tomorrow';
  }
  return `Next check-in in ${days(daysUntil)}`;
};

interface PairingListItemProps {
  pairing: MentorPairing;
  onLogCheckin: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** One pairing: the trainee and the type, then the period and the check-ins. */
const PairingListItem = ({ pairing, onLogCheckin, onEdit, onDelete }: PairingListItemProps) => {
  const { trainee, lastCheckinDate, nextCheckinDate, daysSinceLastCheckin } = pairing;
  const ongoing = isOngoing(pairing);
  // A next check-in only matters while the pairing runs.
  const daysUntilNextCheckin = ongoing && nextCheckinDate ? daysFromToday(nextCheckinDate) : null;

  return (
    <ListItem alignItems="flex-start" disablePadding>
      <ListItemAvatar sx={[{ paddingX: 2, paddingTop: 1.5 }, !ongoing && endedStyle]}>
        <PersonAvatar src={trainee.thumbnailUrl} name={trainee.name} size={40} />
      </ListItemAvatar>
      <Box sx={[{ flex: 1, minWidth: 0, paddingY: 1 }, !ongoing && endedStyle]}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 1, paddingY: 0.5 }}>
          <Link
            component={RouterLink}
            to={trainee.profilePath}
            color="textPrimary"
            underline="hover"
            sx={{ fontWeight: 'bold', overflowWrap: 'anywhere' }}
          >
            {trainee.name}
          </Link>
          <MentorPairingTypeChip type={pairing.type} />
        </Box>
        <Stack direction="row" sx={{ flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, color: 'text.secondary' }}>
          <Typography variant="body2">{formatPeriod(pairing)}</Typography>
          {lastCheckinDate && daysSinceLastCheckin !== null ? (
            <Tooltip title={formatDateForDisplay(lastCheckinDate)} placement="top">
              <Typography variant="body2">{formatLastCheckin(daysSinceLastCheckin)}</Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2">{ongoing ? 'No check-in yet' : 'No check-ins'}</Typography>
          )}
          {nextCheckinDate && daysUntilNextCheckin !== null && (
            <Tooltip title={formatDateForDisplay(nextCheckinDate)} placement="top">
              <Typography
                variant="body2"
                sx={daysUntilNextCheckin < 0 ? { color: 'error.main', fontWeight: 500 } : undefined}
              >
                {formatNextCheckin(daysUntilNextCheckin)}
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, paddingY: 1 }}>
        {ongoing && (
          <Button size="small" variant="outlined" startIcon={<EventAvailableIcon />} onClick={onLogCheckin}>
            Log check-in
          </Button>
        )}
        <ListItemActions onEdit={onEdit} onDelete={onDelete} />
      </Stack>
    </ListItem>
  );
};

interface PairingListProps {
  pairings: MentorPairing[];
  onLogCheckin: (pairing: MentorPairing) => void;
  onEdit: (pairing: MentorPairing) => void;
  onDelete: (pairing: MentorPairing) => void;
}

/** The pairings, the ongoing ones first and the ended ones under them, each in the server's order. */
export const PairingList = ({ pairings, onLogCheckin, onEdit, onDelete }: PairingListProps) => {
  if (pairings.length === 0) {
    return (
      <Typography sx={{ color: 'text.secondary', paddingX: 2, paddingY: 3, bgcolor: 'background.paper' }}>
        No pairings yet
      </Typography>
    );
  }

  const ongoingPairings = pairings.filter(isOngoing);
  const endedPairings = pairings.filter((pairing) => !isOngoing(pairing));

  const renderList = (items: MentorPairing[]) => (
    <List disablePadding sx={listStyle}>
      {items.map((pairing) => (
        <PairingListItem
          key={pairing.id}
          pairing={pairing}
          onLogCheckin={() => onLogCheckin(pairing)}
          onEdit={() => onEdit(pairing)}
          onDelete={() => onDelete(pairing)}
        />
      ))}
    </List>
  );

  return (
    <Stack spacing={2}>
      {ongoingPairings.length > 0 && renderList(ongoingPairings)}
      {endedPairings.length > 0 && (
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Ended
          </Typography>
          {renderList(endedPairings)}
        </Box>
      )}
    </Stack>
  );
};
