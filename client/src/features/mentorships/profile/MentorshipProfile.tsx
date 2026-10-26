import { Box, Divider, Stack } from '@mui/material';
import { EditedMentorship, Mentorship } from '../Mentorship';

import { MentorshipActions } from './MentorshipActions';
import MentorshipHeader from './MentorshipHeader';
import MentorshipInfo from './MentorshipInfo';
import { ProfileButtons } from '../../../components/profile/ProfileButtons';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useProfileSave } from '../../../hooks/useProfileSave';
import { useState } from 'react';
import { useUpdateMentorship } from '../data/mutations';

interface MentorshipProfileProps {
  mentorship: Mentorship;
}

/** The mentorship profile: the header and the details. */
const MentorshipProfile = ({ mentorship }: MentorshipProfileProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  // A copy of the mentorship with the changes made while editing.
  const [editedMentorship, setEditedMentorship] = useState<EditedMentorship>(mentorship);
  const { isPending: isSaveLoading, mutate: updateMentorship } = useUpdateMentorship();

  const { saveChanges, saveResultSnackbar } = useProfileSave('Mentorship', updateMentorship);
  usePageTitle(`${mentorship.volunteer.name} & ${mentorship.trainee.name}`);

  // Starts editing, or saves the changes while editing.
  const onClickEditButton = () => {
    if (!isEditMode) {
      // A colleague's change may have been loaded since the page opened, so start from the latest data.
      setEditedMentorship(mentorship);
      setIsEditMode(true);
      return;
    }

    // The whole mentorship, as the API replaces it, also when nothing changed.
    saveChanges(editedMentorship, () => setIsEditMode(false));
  };

  // Stops editing and drops the changes.
  const onCancelEdit = () => {
    setIsEditMode(false);
  };

  return (
    <Box sx={{ paddingX: 8, bgcolor: 'background.default' }}>
      <Stack spacing={1} useFlexGap sx={{ paddingTop: 3 }}>
        <MentorshipHeader mentorship={mentorship}>
          <ProfileButtons
            isEditMode={isEditMode}
            isSaving={isSaveLoading}
            onClickEditButton={onClickEditButton}
            onCancel={onCancelEdit}
            actions={<MentorshipActions mentorship={mentorship} />}
          />
        </MentorshipHeader>
        {/* Where the other profiles have their tabs. */}
        <Divider sx={{ marginTop: 2 }} />
      </Stack>
      {saveResultSnackbar}

      <Box sx={{ paddingY: 3 }}>
        <MentorshipInfo
          mentorship={isEditMode ? editedMentorship : mentorship}
          setMentorship={setEditedMentorship}
          isEditing={isEditMode}
        />
      </Box>
    </Box>
  );
};

export default MentorshipProfile;
