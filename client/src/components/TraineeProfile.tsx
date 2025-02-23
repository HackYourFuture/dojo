import { Box, Button, Snackbar } from '@mui/material';
import {
  ContactInfo,
  EducationInfo,
  EmploymentInfo,
  InteractionsInfo,
  PersonalInfo,
  ProfileNav,
  ProfileSidebar,
} from '.';
import { SaveTraineeRequestData, useSaveTraineeInfo, useTraineeInfoData } from '../hooks';
import { useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import MuiAlert from '@mui/material/Alert';
import { Trainee } from '../models';
import { useQueryClient } from 'react-query';
import { useTraineeProfileContext } from '../hooks/useTraineeProfileContext';

interface TraineeProfileProps {
  id: string;
}

/**
 * Component for showing profile page tab and content.
 *
 * @param {string} id trainee id.
 * @returns {ReactNode} A React element that renders profile page tabs and sidebar.
 */
export const TraineeProfile = ({ id }: TraineeProfileProps) => {
  // Default active tab
  const [activeTab, setActiveTab] = useState('personal');
  const { data: traineeData } = useTraineeInfoData(id);
  const { isLoading: isSaveLoading, mutate } = useSaveTraineeInfo(id);
  const { isEditMode, setTrainee, setIsEditMode, getTraineeInfoChanges } = useTraineeProfileContext();
  const queryClient = useQueryClient();

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
   * Save trainee data by calling the saveTraineeInfo mutation.
   * Shows a snackbar with the result of the save operation and refreshes the trainee data.
   * @param editedFields
   */
  const saveTraineeData = async (editedFields: SaveTraineeRequestData) => {
    mutate(editedFields, {
      onSuccess: (data: Trainee) => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Trainee data saved successfully');
        setTrainee(data);

        queryClient.invalidateQueries(['traineeInfo', id]);
        setIsEditMode(false);
      },
      onError: (error) => {
        console.error('There was a problem saving trainee data:', (error as Error).message);
        setSnackbarSeverity('error');
        setSnackbarMessage('Error saving trainee data');
      },
    });
    setSnackbarOpen(true);
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

    const changedFields: SaveTraineeRequestData = getTraineeInfoChanges(traineeData!);
    saveTraineeData(changedFields);
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
    <div style={{ display: 'flex', background: '#fff' }}>
      <Box width="40%" position="sticky" top={0} left={0} height="100%" color="black" style={{ overflowY: 'auto' }}>
        <ProfileSidebar traineeId={id} />
      </Box>
      <Box width="100%" paddingY="16px">
        <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
        <Box display="flex" justifyContent="flex-end" padding="16px" gap={1} marginRight={5}>
          {isEditMode && (
            <Button variant="outlined" disabled={isSaveLoading} onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <LoadingButton variant="contained" loading={isSaveLoading} onClick={onClickEditButton}>
            {isEditMode ? 'Save' : 'Edit'}
          </LoadingButton>
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
    </div>
  );
};
