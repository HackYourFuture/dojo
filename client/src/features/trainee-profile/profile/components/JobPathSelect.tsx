import { DropdownSelect } from './DropdownSelect';
import { JobPath } from '../../../../data/types/Trainee';
import { SelectChangeEvent } from '@mui/material';
import { formatTextToFriendly } from '../../utils/formHelper';

const options = Object.values(JobPath).map((status) => ({
  label: formatTextToFriendly(status),
  value: status,
}));

type JobPathSelectProps = {
  initialValue?: string;
  disabled?: boolean;
  isEditing: boolean;
  value?: string;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export const JobPathSelect: React.FC<JobPathSelectProps> = (props) => {
  return (
    <DropdownSelect {...props} options={options} name="jobPath" id="jobPath" label="jobPath" inputLabel="Job path" />
  );
};
