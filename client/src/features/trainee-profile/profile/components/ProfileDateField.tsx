import { PROFILE_FIELD_WIDTH, ProfileTextField } from './ProfileTextField';
import dayjs, { Dayjs } from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

  // A partly typed date is stored as no date.
  const handleChange = (date: Dayjs | null) => onChange(name, date?.isValid() ? date.format('YYYY-MM-DD') : null);

  return (
    <DatePicker
      name={name}
      label={label}
      // Uncontrolled, so the picker keeps a partly typed date. It mounts with the current value whenever editing starts.
      defaultValue={value ? dayjs(value) : null}
      onChange={handleChange}
      views={['year', 'month', 'day']}
      sx={{ width: PROFILE_FIELD_WIDTH }}
      slotProps={{
        field: { clearable: true },
        textField: { InputLabelProps: { shrink: true } },
      }}
    />
  );
};
