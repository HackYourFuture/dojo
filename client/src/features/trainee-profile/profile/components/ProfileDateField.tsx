import { PROFILE_FIELD_WIDTH, ProfileTextField } from './ProfileTextField';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { formatDateForDisplay } from '../../utils/dateHelper';

interface ProfileDateFieldProps {
  name: string;
  label: string;
  // YYYY-MM-DD
  value: string | null;
  isEditing: boolean;
  onChange: (name: string, value: string | null) => void;
}

/**
 * A date on the profile tabs: a date picker that can be cleared while editing, a read-only value otherwise.
 */
export const ProfileDateField = ({ name, label, value, isEditing, onChange }: ProfileDateFieldProps) => {
  if (!isEditing) {
    return <ProfileTextField name={name} label={label} value={formatDateForDisplay(value)} isEditing={false} />;
  }

  return (
    <DatePicker
      name={name}
      label={label}
      // Uncontrolled, so the picker keeps a partly typed date. It mounts with the current value whenever editing starts.
      defaultValue={value ? dayjs(value) : null}
      // A date the picker rejects, like a partly typed one, is stored as no date.
      onChange={(date, { validationError }) =>
        onChange(name, date && !validationError ? date.format('YYYY-MM-DD') : null)
      }
      views={['year', 'month', 'day']}
      sx={{ width: PROFILE_FIELD_WIDTH }}
      slotProps={{
        field: { clearable: true },
        textField: { InputLabelProps: { shrink: true } },
      }}
    />
  );
};
