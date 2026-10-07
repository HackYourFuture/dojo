import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ProfileValue } from '../../../../components/profile/ProfileValue';
import dayjs from 'dayjs';
import { formatDateForDisplay } from '../../../../data/dates';
import { profileInputStyle } from '../../../../components/profile/fieldStyles';

interface ProfileDateFieldProps {
  name: string;
  label: string;
  // YYYY-MM-DD
  value: string | null;
  isEditing: boolean;
  onChange: (name: string, value: string | null) => void;
}

/**
 * A date on the profile tabs: a date picker that can be cleared while editing, the label and value otherwise.
 */
export const ProfileDateField = ({ name, label, value, isEditing, onChange }: ProfileDateFieldProps) => {
  if (!isEditing) {
    return <ProfileValue label={label} value={formatDateForDisplay(value)} />;
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
      sx={profileInputStyle}
      slotProps={{
        field: { clearable: true },
        textField: { size: 'small', slotProps: { inputLabel: { shrink: true } } },
      }}
    />
  );
};
