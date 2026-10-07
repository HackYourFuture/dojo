import { FieldRow, ProfileSection } from '../../../components/profile/ProfileSection';

import { ContactFields } from '../../../components/profile/ContactFields';
import { ProfileTextField } from '../../../components/profile/ProfileTextField';
import { Stack } from '@mui/material';
import { createTextChangeHandler } from '../utils/formHelper';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

/**
 * Component for displaying contact information in trainee profile data on the contact tab.
 *
 * @returns {ReactNode} A React element that renders trainee contact information with view, add, and edit logic.
 */
const ContactInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { contactInfo: editedFields } = trainee;

  const handleTextChange = createTextChangeHandler(setTrainee, 'contactInfo');

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <ContactFields contact={editedFields} isEditing={isEditing} onChange={handleTextChange} />
      </ProfileSection>

      <ProfileSection title="Emergency contact">
        <FieldRow fill>
          <ProfileTextField
            name="emergencyContactName"
            label="Name"
            placeholder="Steve Doe"
            value={editedFields.emergencyContactName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="emergencyContactRelationship"
            label="Relationship"
            placeholder="Sister"
            value={editedFields.emergencyContactRelationship}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="emergencyContactPhone"
            label="Phone"
            type="tel"
            placeholder="+1234567890"
            value={editedFields.emergencyContactPhone}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
      </ProfileSection>
    </Stack>
  );
};

export default ContactInfo;
