import { FieldRow, ProfileSection } from '../../../components/profile/ProfileSection';
import { jobPathOptions, yesNoOptions } from '../utils/selectOptions';

import { EmploymentHistoryGroup } from './components/EmploymentHistoryGroup';
import { ProfileDateField } from '../profile/components/ProfileDateField';
import { ProfileSelect } from '../../../components/profile/ProfileSelect';
import { Stack } from '@mui/material';
import { createValueChangeHandler } from '../utils/formHelper';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
export const EmploymentInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { employmentInfo: editedFields } = trainee;

  const handleValueChange = createValueChangeHandler(setTrainee, 'employmentInfo');

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
            onChange={handleValueChange}
          />
          <ProfileDateField
            name="jobSupportEndDate"
            label="Job support end date"
            value={editedFields.jobSupportEndDate}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileSelect
            name="hasCar"
            label="Has a car"
            options={yesNoOptions}
            value={editedFields.hasCar}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
      </ProfileSection>

      <EmploymentHistoryGroup />
    </Stack>
  );
};

export default EmploymentInfo;
