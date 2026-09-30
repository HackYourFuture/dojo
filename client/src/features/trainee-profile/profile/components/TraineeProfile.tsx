import { Box, Snackbar, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import ContactInfo from '../../contact/ContactInfo';
import { EditSaveButton } from './EditSaveButton';
import EducationInfo from '../../education/EducationInfo';
import EmploymentInfo from '../../employment/EmploymentInfo';
import InteractionsInfo from '../../interactions/InteractionsInfo';
import MuiAlert from '@mui/material/Alert';
import PersonalInfo from '../../personal-info/PersonalInfo';
import ProfileHeader from '../ProfileHeader';
import ProfileNav from './ProfileNav';
import { TraineeChanges } from '../../../../data/types/Trainee';
import { useGetTrainee } from '../../data/trainee-queries';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';
import { useUpdateTrainee } from '../../data/mutations';

interface TraineeProfileProps {
  id: string;
}

/**
 * Component for showing profile page tab and content.
 *
 * @param {string} id trainee id.
 * @returns {ReactNode} A React element that renders profile page tabs and sidebar.
 */
const TraineeProfile = ({ id }: TraineeProfileProps) => {
  // Default active tab
  const [activeTab, setActiveTab] = useState('personal');
  const { data: traineeData } = useGetTrainee(id);
  const { isPending: isSaveLoading, mutate: updateTrainee } = useUpdateTrainee(id);
  const { isEditMode, setIsEditMode, getTraineeInfoChanges } = useTraineeProfileContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (traineeData) {
      document.title = `${traineeData.displayName} | Dojo`;
      return;
    }
    document.title = 'Trainee Profile | Dojo';
  }, [traineeData]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * Save trainee data by calling the updateTrainee mutation.
   * Shows a snackbar with the result of the save operation and refreshes the trainee data.
   * @param changes
   */
  const saveTraineeData = (changes: TraineeChanges) => {
    updateTrainee(changes, {
      onSuccess: () => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Trainee data saved successfully');
        setSnackbarOpen(true);
        setIsEditMode(false);
      },
      onError: (error) => {
        console.error('There was a problem saving trainee data:', error.message);
        // The server validates the whole profile, so its message names the field that blocks the save.
        setSnackbarSeverity('error');
        setSnackbarMessage(`Error saving trainee data: ${error.message}`);
        setSnackbarOpen(true);
      },
    });
  };

  /**
   * Handle edit button click.
   * Either sets the page to edit mode or saves the changes if edit mode is active.
   */
  const onClickEditButton = () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    const changes = getTraineeInfoChanges();
    // Nothing to save, and the API rejects an update without fields.
    if (Object.keys(changes).length === 0) {
      setIsEditMode(false);
      return;
    }
    saveTraineeData(changes);
  };

  /**
   * Handle cancel edit button click.
   * Drops the changes, so the tabs show the saved trainee again.
   */
  const onCancelEdit = () => {
    setIsEditMode(false);
  };

  // Interactions are edited one by one, so their tab only needs Save and Cancel while the profile is being edited.
  const showsEditButtons = activeTab !== 'interactions' || isEditMode;

  return (
    // The tabs have no padding of their own, so everything lines up with the header.
    <Box paddingX={8} bgcolor="background.default">
      <Stack spacing={1} useFlexGap paddingTop={3}>
        <ProfileHeader traineeId={id} />
        {/* Keeps its height when the edit buttons are hidden. */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          minHeight={56}
          borderBottom={1}
          borderColor="divider"
        >
          <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
          {showsEditButtons && (
            <EditSaveButton
              isEditMode={isEditMode}
              isLoading={isSaveLoading}
              onCancel={onCancelEdit}
              onClickEditButton={onClickEditButton}
            />
          )}
        </Box>
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Box paddingY={3}>
        {activeTab === 'personal' && <PersonalInfo />}
        {activeTab === 'contact' && <ContactInfo />}
        {activeTab === 'education' && <EducationInfo />}
        {activeTab === 'employment' && <EmploymentInfo />}
        {activeTab === 'interactions' && <InteractionsInfo />}
      </Box>
    </Box>
  );
};

export default TraineeProfile;
