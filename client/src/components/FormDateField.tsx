import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { formatDate } from '../features/trainee-profile/utils/dateHelper';

interface FormDateFieldProps {
  label: string;
  // A calendar date at midnight UTC, the form the modals keep their dates in.
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  clearable?: boolean;
}

/** A date picker for the add and edit modals. */
export const FormDateField = ({ label, value, onChange, disabled, error, required, clearable }: FormDateFieldProps) => {
  return (
    <DatePicker
      label={label}
      // Uncontrolled, so the picker keeps a partly typed date. The modals mount it again every time they open.
      defaultValue={value ? dayjs(formatDate(value)) : null}
      // A date the picker rejects, like a partly typed one, is stored as no date.
      onChange={(date, { validationError }) =>
        onChange(date && !validationError ? new Date(date.format('YYYY-MM-DD')) : null)
      }
      disabled={disabled}
      views={['year', 'month', 'day']}
      slotProps={{
        field: { clearable },
        // Only forces the error on, so the picker still marks an invalid date itself.
        textField: {
          required,
          fullWidth: true,
          error: error || undefined,
          slotProps: { inputLabel: { shrink: true } },
        },
      }}
    />
  );
};
