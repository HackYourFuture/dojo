import { MenuItem } from '@mui/material';
import { ProfileTextField } from './ProfileTextField';
import { ProfileValue } from './ProfileValue';
import { SelectOption } from '../../utils/selectOptions';

// A boolean matches the values of yesNoOptions.
type ProfileSelectValue = string | boolean | null;

interface ProfileSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  value: ProfileSelectValue;
  // Adds a "- Not set -" option, which clears the field.
  nullable?: boolean;
  isEditing: boolean;
  onChange: (name: string, value: ProfileSelectValue) => void;
}

// The dropdown holds its values as text, and '' when nothing is selected.
const parseSelectValue = (value: string): ProfileSelectValue => {
  switch (value) {
    case '':
      return null;
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return value;
  }
};

/**
 * A dropdown on the profile tabs, sized like ProfileTextField: an outlined select while editing, the label and value otherwise.
 */
export const ProfileSelect = ({
  name,
  label,
  options,
  value,
  nullable = false,
  isEditing,
  onChange,
}: ProfileSelectProps) => {
  const selectedValue = String(value ?? '');

  if (!isEditing) {
    // Pronouns are free text, so they may not match an option.
    const selectedLabel = options.find((option) => option.value === selectedValue)?.label ?? selectedValue;
    return <ProfileValue label={label} value={selectedLabel} />;
  }

  return (
    <ProfileTextField
      select
      name={name}
      label={label}
      value={selectedValue}
      isEditing
      onChange={(event) => onChange(name, parseSelectValue(event.target.value))}
    >
      {nullable && <MenuItem value="">- Not set -</MenuItem>}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </ProfileTextField>
  );
};
