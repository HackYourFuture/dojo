import { DropdownSelect } from './DropdownSelect';
import { LearningStatus } from '../../../../data/types/Trainee';
import { SelectChangeEvent, SxProps, Theme } from '@mui/material';
import { learningStatusToLabel } from '../../../../data/labels/traineeLabels';

const options = Object.values(LearningStatus).map((status) => ({
  label: learningStatusToLabel(status),
  value: status,
}));

type LearningStatusSelectProps = {
  initialValue?: string;
  disabled?: boolean;
  isEditing: boolean;
  value?: string;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  sx?: SxProps<Theme>;
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
