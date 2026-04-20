import { DropdownSelect } from './DropdownSelect';
import { LearningStatus } from '../../../../data/types/Trainee';
import { SelectChangeEvent } from '@mui/material';
import { formatTextToFriendly } from '../../utils/formHelper';

const learningStatusToLabel = (status?: LearningStatus | string): string => {
  switch (status) {
    case LearningStatus.Studying:
      return 'Studying';
    case LearningStatus.Graduated:
      return 'Graduated';
    case LearningStatus.OnHold:
      return 'On hold';
    case LearningStatus.Quit:
      return 'Quit';
    default:
      return formatTextToFriendly(status ? String(status) : '');
  }
};

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
      width={'15ch'}
    />
  );
};
