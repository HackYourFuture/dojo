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
import { useTraineeProfileContext } from '../hooks/traineeProfileContext';

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
  const { data } = useTraineeInfoData(id);
  const { isLoading: isSaveLoading, mutate } = useSaveTraineeInfo(id);
  const context = useTraineeProfileContext();
  const queryClient = useQueryClient();

  const [traineeData, setTraineeData] = useState(data && data); //TODO: To be removed
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    document.title = `${context.trainee.displayName} | Dojo`;
  }, [data]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const saveTraineeData = async (editedFields: SaveTraineeRequestData) => {
    mutate(editedFields, {
      onSuccess: (data: Trainee) => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Trainee data saved successfully');
        context.setTrainee(data);

        queryClient.invalidateQueries(['traineeInfo', id]);
        context.setIsEditMode(false);
      },
      onError: (error) => {
        // TOOD: Better error handling
        console.error('There was a problem saving trainee data:', error.message);
        setSnackbarSeverity('error');
        setSnackbarMessage('Error saving trainee data');
      },
    });
    setSnackbarOpen(true);
  };

  const onClickEditButton = () => {
    const { isEditMode, setIsEditMode } = context;
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    const chagedTrainee = context.getTraineeInfoChanges(traineeData!);
    saveTraineeData(chagedTrainee);
  };

  const onCancelEdit = () => {
    context.setIsEditMode(false);
    context.setTrainee(traineeData!);
  };

  return (
    <div style={{ display: 'flex', background: '#fff' }}>
      <Box width="40%" position="sticky" top={0} left={0} height="100%" color="black" style={{ overflowY: 'auto' }}>
        <ProfileSidebar traineeId={id} />
      </Box>
      <Box width="100%" paddingY="16px">
        <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
        <Box display="flex" justifyContent="flex-end" padding="16px" gap={1} marginRight={5}>
          {context.isEditMode && (
            <Button variant="outlined" disabled={isSaveLoading} onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <LoadingButton variant="contained" loading={isSaveLoading} onClick={onClickEditButton}>
            {context.isEditMode ? 'Save' : 'Edit'}
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
        {activeTab === 'contact' && (
          <ContactInfo contactData={traineeData && traineeData.contactInfo} saveTraineeData={() => {}} />
        )}
        {activeTab === 'education' && (
          <EducationInfo educationData={traineeData && traineeData.educationInfo} saveTraineeData={() => {}} />
        )}
        {activeTab === 'employment' && (
          <EmploymentInfo employmentData={traineeData && traineeData.employmentInfo} saveTraineeData={() => {}} />
        )}
        {activeTab === 'interactions' && <InteractionsInfo />}
      </Box>
    </div>
  );
};
