import { Box, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

import ContactInfo from '../../contact/ContactInfo';
import { EditSaveButton } from './EditSaveButton';
import EducationInfo from '../../education/EducationInfo';
import EmploymentInfo from '../../employment/EmploymentInfo';
import InteractionsInfo from '../../interactions/InteractionsInfo';
import MuiAlert from '@mui/material/Alert';
import PersonalInfo from '../../personal-info/PersonalInfo';
import ProfileNav from './ProfileNav';
import ProfileSidebar from '../ProfileSidebar';
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
  const { isEditMode, setTrainee, setIsEditMode, getTraineeInfoChanges } = useTraineeProfileContext();

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
      onSuccess: (trainee) => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Trainee data saved successfully');
        setSnackbarOpen(true);
        setTrainee(trainee);
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
   * Resets the trainee data to the original data.
   */
  const onCancelEdit = () => {
    setIsEditMode(false);
    setTrainee(traineeData!);
  };

  return (
    <Box style={{ display: 'flex' }} bgcolor={'background.default'}>
      <Box width="40%" position="sticky" top={0} left={0} height="100%" color="black" style={{ overflowY: 'auto' }}>
        <ProfileSidebar traineeId={id} />
      </Box>
      <Box width="100%" paddingY="16px">
        <Box display="flex" justifyContent="space-between">
          <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
          {activeTab === 'interactions' ? null : (
            <EditSaveButton
              isEditMode={isEditMode}
              isLoading={isSaveLoading}
              onCancel={onCancelEdit}
              onClickEditButton={onClickEditButton}
            />
          )}
        </Box>
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
