import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { PROFILE_FIELD_WIDTH, ProfileTextField } from './ProfileTextField';

import { NumberField } from '@base-ui/react/number-field';

// Rounds a typed decimal to a whole number.
const WHOLE_NUMBER_FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };

interface ProfileNumberFieldProps {
  name: string;
  label: string;
  value: number | null;
  max?: number;
  // Shown instead of an empty value when not editing.
  emptyText?: string;
  isEditing: boolean;
  onChange: (name: string, value: number | null) => void;
}

/**
 * A whole number on the profile tabs: MUI's number field without the arrow buttons while editing, a read-only value otherwise.
 */
export const ProfileNumberField = ({
  name,
  label,
  value,
  max,
  emptyText,
  isEditing,
  onChange,
}: ProfileNumberFieldProps) => {
  if (!isEditing) {
    return <ProfileTextField name={name} label={label} value={value ?? emptyText} isEditing={false} />;
  }

  // Composed as in https://mui.com/material-ui/react-number-field/
  return (
    <NumberField.Root
      id={name}
      value={value}
      min={0}
      max={max}
      format={WHOLE_NUMBER_FORMAT}
      onValueChange={(newValue) => onChange(name, newValue)}
      render={(props) => (
        <FormControl ref={props.ref} sx={{ width: PROFILE_FIELD_WIDTH }}>
          {props.children}
        </FormControl>
      )}
    >
      <InputLabel htmlFor={name} shrink>
        {label}
      </InputLabel>
      <NumberField.Input
        render={(props, state) => (
          <OutlinedInput
            label={label}
            notched
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            slotProps={{ input: props }}
          />
        )}
      />
    </NumberField.Root>
  );
};
