import { DropdownSelect } from './DropdownSelect';
import { Gender } from '../../../../data/types/Trainee';
import { SelectChangeEvent } from '@mui/material';
import { formatTextToFriendly } from '../../utils/formHelper';

const genderOptions = Object.values(Gender).map((gender) => ({
  label: formatTextToFriendly(gender),
  value: gender,
}));

type GenderSelectProps = {
  initialValue?: string;
  disabled?: boolean;
  isEditing: boolean;
  value?: string;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export const GenderSelect: React.FC<GenderSelectProps> = (props) => {
  return (
    <DropdownSelect {...props} options={genderOptions} name="gender" id="gender" label="gender" inputLabel="Gender" />
  );
};
