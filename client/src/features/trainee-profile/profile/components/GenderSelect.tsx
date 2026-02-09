import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Gender } from '../../../../data/types/Trainee';
import { capitalize } from '../../utils/stringHelper';

type GenderSelectProps = {
  isEditing: boolean;
  gender?: Gender | null;
  error?: string;
  onChange: (event: SelectChangeEvent) => void;
};

const genderOptions: Gender[] = Object.values(Gender);

export const GenderSelect: React.FC<GenderSelectProps> = ({ isEditing, gender = '', error, onChange = () => {} }) => {
  const NoIcon = () => null;

  return (
    <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
      <InputLabel htmlFor="gender">Gender</InputLabel>
      <Select
        error={!!error}
        name="gender"
        id="gender"
        label="Gender"
        value={gender || ''}
        inputProps={{ readOnly: isEditing ? false : true }}
        IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
        startAdornment=" "
        onChange={onChange}
      >
        {genderOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {capitalize(option)}
          </MenuItem>
        ))}
        <FormHelperText error={!!error}>{error}</FormHelperText>
      </Select>
    </FormControl>
  );
};
