import { DropdownSelect } from './DropdownSelect';
import { LearningStatus } from '../../../../data/types/Trainee';
import { SelectChangeEvent } from '@mui/material';
import { formatTextToFriendly } from '../../utils/formHelper';

const options = Object.values(LearningStatus).map((status) => ({
  label: formatTextToFriendly(status),
  value: status,
}));

type LearningStatusSelectProps = {
  initialValue?: string;
  disabled?: boolean;
  isEditing: boolean;
  value?: string;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export const LearningStatusSelect: React.FC<LearningStatusSelectProps> = (props) => {
  return (
    <DropdownSelect
      {...props}
      options={options}
      name="learningStatus"
      id="learningStatus"
      label="learningStatus"
      inputLabel="Learning Status"
    />
  );
};
