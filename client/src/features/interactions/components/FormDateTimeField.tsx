import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

interface FormDateTimeFieldProps {
  label: string;
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
}

/** A date and time picker for the add and edit modals, in 24 hour time and without seconds. */
const FormDateTimeField = ({ label, value, onChange, disabled, error, required }: FormDateTimeFieldProps) => {
  return (
    <DateTimePicker
      label={label}
      // Uncontrolled, so the picker keeps a partly typed date. The modal mounts it again every time it opens.
      defaultValue={value ? dayjs(value) : null}
      // A date the picker rejects, like a partly typed one, is stored as no date. Seconds are dropped, as the picker hides them.
      onChange={(date, { validationError }) =>
        onChange(date && !validationError ? date.startOf('minute').toDate() : null)
      }
      disabled={disabled}
      ampm={false}
      views={['year', 'month', 'day', 'hours', 'minutes']}
      slotProps={{
        // Only forces the error on, so the picker still marks an invalid date itself.
        textField: { required, fullWidth: true, error: error || undefined, InputLabelProps: { shrink: true } },
      }}
    />
  );
};

export default FormDateTimeField;
