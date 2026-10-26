import { Chip, Stack, Tooltip } from '@mui/material';
import { addDays, formatDateForDisplay } from '../../../data/dates';

// The next check-in shortcuts, in days after the date they count from.
const NEXT_CHECKIN_SHORTCUTS = [7, 14, 30];

interface NextCheckinShortcutsProps {
  // The date the shortcuts count from.
  from: Date;
  disabled?: boolean;
  onPick: (date: Date) => void;
}

/** The +7d, +14d and +30d chips under a next check-in field, which set it to that many days after `from`. */
export const NextCheckinShortcuts = ({ from, disabled, onPick }: NextCheckinShortcutsProps) => (
  <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
    {NEXT_CHECKIN_SHORTCUTS.map((days) => (
      // The date describes the chip, so a screen reader still says "+7d" as its name.
      <Tooltip key={days} title={formatDateForDisplay(addDays(from, days))} placement="bottom" describeChild>
        <Chip
          label={`+${days}d`}
          size="small"
          variant="outlined"
          disabled={disabled}
          onClick={() => onPick(addDays(from, days))}
        />
      </Tooltip>
    ))}
  </Stack>
);
