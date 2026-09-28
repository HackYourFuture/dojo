import { FieldRow, ProfileSection } from '../profile/components/ProfileSection';
import { createSelectChangeHandler, createTextChangeHandler } from '../utils/formHelper';
import { jobPathOptions, yesNoOptions } from '../utils/selectOptions';

import { EmploymentHistoryGroup } from './components/EmploymentHistoryGroup';
import { ProfileSelect } from '../profile/components/ProfileSelect';
import { ProfileTextField } from '../profile/components/ProfileTextField';
import { Stack } from '@mui/material';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
export const EmploymentInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { employmentInfo: editedFields } = trainee;

  const handleTextChange = createTextChangeHandler(setTrainee, 'employmentInfo');
  const handleSelectChange = createSelectChangeHandler(setTrainee, 'employmentInfo');

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow>
          <ProfileSelect
            name="jobPath"
            label="Job path"
            options={jobPathOptions}
            value={editedFields.jobPath}
            isEditing={isEditing}
            onChange={handleSelectChange}
          />
          <ProfileTextField
            name="jobSupportEndDate"
            label="Job support end date"
            type="date"
            value={editedFields.jobSupportEndDate}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileSelect
            name="hasCar"
            label="Has a car"
            options={yesNoOptions}
            value={editedFields.hasCar}
            isEditing={isEditing}
            onChange={handleSelectChange}
          />
        </FieldRow>
      </ProfileSection>

      <EmploymentHistoryGroup />
    </Stack>
  );
};

export default EmploymentInfo;
