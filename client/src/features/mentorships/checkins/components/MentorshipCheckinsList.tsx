import { Box, List, ListItem, Typography } from '@mui/material';

import { ListItemActions } from '../../../../components/ListItemActions';
import MarkdownText from '../../../../components/MarkdownText';
import { MentorshipCheckin } from '../MentorshipCheckin';
import { formatDateForDisplay } from '../../../../data/dates';

// The dot that marks a check-in on the timeline.
const dotStyle = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  // (40px "..." button - 12px dot) / 2, so the dot is level with the date beside that button.
  marginTop: '14px',
  flexShrink: 0,
};

// The line from a check-in down to the next one.
const lineStyle = { flex: 1, width: '2px', bgcolor: 'divider', marginTop: 0.5 };

interface MentorshipCheckinsListProps {
  checkins: MentorshipCheckin[];
  onClickEdit: (checkin: MentorshipCheckin) => void;
  onClickDelete: (checkin: MentorshipCheckin) => void;
}

/** The check-ins as a timeline, the latest first, each with its date, its notes and a "..." menu to edit or delete it. */
export const MentorshipCheckinsList = ({ checkins, onClickEdit, onClickDelete }: MentorshipCheckinsListProps) => {
  if (checkins.length === 0) {
    return <Typography sx={{ color: 'text.secondary' }}>No check-ins yet</Typography>;
  }

  return (
    <List disablePadding>
      {checkins.map((checkin, index) => (
        <ListItem key={checkin.id} alignItems="flex-start" disablePadding>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: 'stretch',
              marginRight: 2,
            }}
          >
            <Box sx={dotStyle} />
            {index < checkins.length - 1 && <Box sx={lineStyle} />}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, paddingBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold' }}>{formatDateForDisplay(checkin.date)}</Typography>
              <ListItemActions onEdit={() => onClickEdit(checkin)} onDelete={() => onClickDelete(checkin)} />
            </Box>
            {/* Without the margin under the last paragraph, the gap to the next check-in is the same everywhere. */}
            <Typography component="div" sx={{ '& > * > :last-child': { marginBottom: 0 } }}>
              <MarkdownText>{checkin.notes}</MarkdownText>
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};
