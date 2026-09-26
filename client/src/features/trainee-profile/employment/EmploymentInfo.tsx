import { Box } from '@mui/material';
import { EmploymentHistoryGroup } from './components/EmploymentHistoryGroup';
import { JobPathSelect } from '../profile/components/JobPathSelect';
import { createSelectChangeHandler } from '../utils/formHelper';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
export const EmploymentInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { employmentInfo: editedFields } = trainee;

  const handleSelectChange = createSelectChangeHandler(setTrainee, 'employmentInfo');

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} padding="24px">
      <div style={{ width: '100%' }}>
        {/* Job path */}
        <JobPathSelect isEditing={isEditing} value={editedFields.jobPath} onChange={handleSelectChange} />
      </div>

      {/* Employment history */}
      <EmploymentHistoryGroup />
    </Box>
  );
};

export default EmploymentInfo;
