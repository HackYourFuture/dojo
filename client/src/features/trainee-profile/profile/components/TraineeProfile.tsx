import { Box, Stack, Tab } from '@mui/material';

import ContactInfo from '../../contact/ContactInfo';
import EducationInfo from '../../education/EducationInfo';
import EmploymentInfo from '../../employment/EmploymentInfo';
import InteractionsInfo from '../../../interactions/InteractionsInfo';
import { InteractionsTabLabel } from '../../../interactions/components/InteractionsTabLabel';
import PersonalInfo from '../../personal-info/PersonalInfo';
import ProfileHeader from '../ProfileHeader';
import { ProfileTabBar } from '../../../../components/profile/ProfileTabBar';
import { usePageTitle } from '../../../../hooks/usePageTitle';
import { useProfileSave } from '../../../../hooks/useProfileSave';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';
import { useUpdateTrainee } from '../../data/mutations';

interface TraineeProfileProps {
  id: string;
}

/** The trainee profile: the header, the tabs and the content of the active tab. */
const TraineeProfile = ({ id }: TraineeProfileProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const { isPending: isSaveLoading, mutate: updateTrainee } = useUpdateTrainee(id);
  const { trainee, isEditMode, setIsEditMode, getTraineeInfoChanges } = useTraineeProfileContext();
  const { saveChanges, saveResultSnackbar } = useProfileSave('Trainee', updateTrainee);
  usePageTitle(trainee.displayName);

  // Starts editing, or saves the changes while editing.
  const onClickEditButton = () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    saveChanges(getTraineeInfoChanges(), () => setIsEditMode(false));
  };

  // Stops editing and drops the changes, so the tabs show the saved trainee again.
  const onCancelEdit = () => {
    setIsEditMode(false);
  };

  return (
    // The tabs have no padding of their own, so everything lines up with the header.
    <Box sx={{ paddingX: 8, bgcolor: 'background.default' }}>
      <Stack spacing={1} useFlexGap sx={{ paddingTop: 3 }}>
        <ProfileHeader traineeId={id} />
        <ProfileTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isEditMode={isEditMode}
          isSaving={isSaveLoading}
          onClickEditButton={onClickEditButton}
          onCancel={onCancelEdit}
        >
          <Tab label="Personal" value="personal" />
          <Tab label="Contact" value="contact" />
          <Tab label="Education" value="education" />
          <Tab label="Employment" value="employment" />
          <Tab label={<InteractionsTabLabel profileType="trainee" profileId={id} />} value="interactions" />
        </ProfileTabBar>
      </Stack>
      {saveResultSnackbar}

      <Box sx={{ paddingY: 3 }}>
        {activeTab === 'personal' && <PersonalInfo />}
        {activeTab === 'contact' && <ContactInfo />}
        {activeTab === 'education' && <EducationInfo />}
        {activeTab === 'employment' && <EmploymentInfo />}
        {activeTab === 'interactions' && <InteractionsInfo profileType="trainee" profileId={id} />}
      </Box>
    </Box>
  );
};

export default TraineeProfile;
