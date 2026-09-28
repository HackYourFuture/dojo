import { DropdownSelect } from './DropdownSelect';
import { PROFILE_FIELD_WIDTH } from './ProfileTextField';
import { SelectChangeEvent } from '@mui/material';
import { SelectOption } from '../../utils/selectOptions';

interface ProfileSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  // A boolean matches the values of yesNoOptions.
  value: string | boolean | null;
  isEditing: boolean;
  onChange: (event: SelectChangeEvent<string>) => void;
}

/**
 * A dropdown on the profile tabs, sized like ProfileTextField.
 */
export const ProfileSelect = ({ name, value, ...props }: ProfileSelectProps) => (
  <DropdownSelect {...props} id={name} name={name} value={String(value ?? '')} width={PROFILE_FIELD_WIDTH} />
);
