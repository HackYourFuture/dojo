import { DropdownSelect } from './DropdownSelect';
import { Gender } from '../../../../data/types/Trainee';
import { SelectChangeEvent } from '@mui/material';
import { formatTextToFriendly } from '../../utils/formHelper';

type GenderSelectProps = {
  disabled?: boolean;
  isEditing: boolean;
  value?: string;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

const genderOptions = Object.values(Gender).map((gender) => formatTextToFriendly(gender));

export const GenderSelect: React.FC<GenderSelectProps> = (props) => {
  return (
    <DropdownSelect {...props} options={genderOptions} name="gender" id="gender" label="Gender" inputLabel="gender" />
  );
};
