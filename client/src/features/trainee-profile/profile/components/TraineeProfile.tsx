import { Box, Stack, Tab } from '@mui/material';

import ContactInfo from '../../contact/ContactInfo';
import EducationInfo from '../../education/EducationInfo';
import EmploymentInfo from '../../employment/EmploymentInfo';
import InteractionsInfo from '../../../interactions/InteractionsInfo';
import { InteractionsTabLabel } from '../../../interactions/components/InteractionsTabLabel';
import PersonalInfo from '../../personal-info/PersonalInfo';
import { ProfileButtons } from '../../../../components/profile/ProfileButtons';
import ProfileHeader from '../ProfileHeader';
import { ProfileTabBar } from '../../../../components/profile/ProfileTabBar';
import { TraineeActions } from '../TraineeActions';
import { usePageTitle } from '../../../../hooks/usePageTitle';
import { useProfileSave } from '../../../../hooks/useProfileSave';
import { useProfileTab } from '../../../../hooks/useProfileTab';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';
import { useUpdateTrainee } from '../../data/mutations';

// The open tab is in the URL, and Slack links to the interactions, employment and education tabs by name.
const TABS = ['personal', 'contact', 'education', 'employment', 'interactions'];

interface TraineeProfileProps {
  id: string;
}

/** The trainee profile: the header, the tabs and the content of the active tab. */
const TraineeProfile = ({ id }: TraineeProfileProps) => {
  const { trainee, isEditMode, setIsEditMode, getTraineeInfoChanges } = useTraineeProfileContext();
  const [activeTab, setActiveTab] = useProfileTab(trainee.profilePath, TABS);
  const { isPending: isSaveLoading, mutate: updateTrainee } = useUpdateTrainee(id);
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
        <ProfileHeader traineeId={id}>
          <ProfileButtons
            activeTab={activeTab}
            isEditMode={isEditMode}
            isSaving={isSaveLoading}
            onClickEditButton={onClickEditButton}
            onCancel={onCancelEdit}
            actions={<TraineeActions traineeId={id} name={trainee.displayName} />}
          />
        </ProfileHeader>
        <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab}>
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
