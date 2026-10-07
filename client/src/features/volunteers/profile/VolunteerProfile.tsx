import { Box, Stack, Tab } from '@mui/material';
import { EDITABLE_VOLUNTEER_FIELDS, Volunteer, VolunteerChanges } from '../Volunteer';

import { ContactFields } from '../../../components/profile/ContactFields';
import { ProfileSection } from '../../../components/profile/ProfileSection';
import { ProfileTabBar } from '../../../components/profile/ProfileTabBar';
import VolunteerHeader from './VolunteerHeader';
import VolunteerInfo from './VolunteerInfo';
import { createFieldChangeHandlers } from '../../../components/profile/fieldChangeHandlers';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useProfileSave } from '../../../hooks/useProfileSave';
import { useState } from 'react';
import { useUpdateVolunteer } from '../data/mutations';

// The fields that were changed while editing, with their new values.
const getChangedFields = (original: Volunteer, edited: Volunteer): VolunteerChanges => {
  const changedFields = EDITABLE_VOLUNTEER_FIELDS.filter((field) => original[field] !== edited[field]);
  return Object.fromEntries(changedFields.map((field) => [field, edited[field]]));
};

interface VolunteerProfileProps {
  volunteer: Volunteer;
}

/** The volunteer profile: the header, the tabs and the content of the active tab. */
const VolunteerProfile = ({ volunteer }: VolunteerProfileProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  // A copy of the volunteer with the changes made while editing.
  const [editedVolunteer, setEditedVolunteer] = useState<Volunteer>(volunteer);
  const { isPending: isSaveLoading, mutate: updateVolunteer } = useUpdateVolunteer(volunteer.id);

  const { saveChanges, saveResultSnackbar } = useProfileSave('Volunteer', updateVolunteer);
  usePageTitle(volunteer.displayName);

  // Starts editing, or saves the changes while editing.
  const onClickEditButton = () => {
    if (!isEditMode) {
      // A colleague's change may have been loaded since the page opened, so start from the latest data.
      setEditedVolunteer(volunteer);
      setIsEditMode(true);
      return;
    }

    saveChanges(getChangedFields(volunteer, editedVolunteer), () => setIsEditMode(false));
  };

  // Stops editing and drops the changes.
  const onCancelEdit = () => {
    setIsEditMode(false);
  };

  // For the contact tab, which has only text fields.
  const { handleTextChange } = createFieldChangeHandlers(setEditedVolunteer);

  return (
    // The tabs have no padding of their own, so everything lines up with the header.
    <Box sx={{ paddingX: 8, bgcolor: 'background.default' }}>
      <Stack spacing={1} useFlexGap sx={{ paddingTop: 3 }}>
        <VolunteerHeader volunteer={volunteer} />
        <ProfileTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isEditMode={isEditMode}
          isSaving={isSaveLoading}
          onClickEditButton={onClickEditButton}
          onCancel={onCancelEdit}
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Contact" value="contact" />
          <Tab label="Interactions" value="interactions" />
        </ProfileTabBar>
      </Stack>
      {saveResultSnackbar}

      {/* The interactions tab stays empty until volunteer interactions are built. */}
      <Box sx={{ paddingY: 3 }}>
        {activeTab === 'overview' && (
          <VolunteerInfo
            volunteer={isEditMode ? editedVolunteer : volunteer}
            setVolunteer={setEditedVolunteer}
            isEditing={isEditMode}
          />
        )}
        {activeTab === 'contact' && (
          <ProfileSection>
            <ContactFields
              contact={isEditMode ? editedVolunteer : volunteer}
              isEditing={isEditMode}
              onChange={handleTextChange}
            />
          </ProfileSection>
        )}
      </Box>
    </Box>
  );
};

export default VolunteerProfile;
