import { Box, Button, Snackbar } from '@mui/material';
import {
  ContactInfo,
  EducationInfo,
  EmploymentInfo,
  ErrorBox,
  InteractionsInfo,
  Loader,
  PersonalInfo,
  ProfileNav,
  ProfileSidebar,
} from '.';
import { SaveTraineeRequestData, useSaveTraineeInfo, useTraineeInfoData } from '../hooks';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import MuiAlert from '@mui/material/Alert';
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
  const { isLoading, isError, data, error, isFetching } = useTraineeInfoData(id);
  const { isError: isSavingError, isLoading: isSaveLoading, mutate } = useSaveTraineeInfo(id);
  const context = useTraineeProfileContext();

  const [traineeData, setTraineeData] = useState(data && data);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return <ErrorBox errorMessage={error.message} />;
  }

  useEffect(() => {
    document.title = `${traineeData?.displayName} | Dojo`;
  }, [traineeData]);

  /**
   * Function to navigate to active tab.
   *
   * @param {string} tab active tab to open.
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * Function to save trainee info after add/edit.
   *
   * @param {Object} editedData Object with added/edited trainee info.
   */
  const saveTraineeData = async (
    // editedData: TraineePersonalInfo | TraineeContactInfo | TraineeEducationInfo | TraineeEmploymentInfo
    editedFields: SaveTraineeRequestData
  ) => {
    // TODO: createt a new object that is differences
    mutate(editedFields, {
      onSuccess: () => {
        // TODO: invalidate the cache
        setSnackbarSeverity('success');
        setSnackbarMessage('Trainee data saved successfully');
      },
      onError: (error) => {
        console.error('There was a problem saving trainee data:', error.message);
        setSnackbarSeverity('error');
        setSnackbarMessage('Error saving trainee data');
      },
    });
    setSnackbarOpen(true);
  };

  /**
   * if in edit mode, save the changes,
   * else enable edit mode.
   *
   */
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
    // TODO: Resrt the fields
  };
  return (
    <div style={{ display: 'flex', background: '#fff' }}>
      <Box width="40%" position="sticky" top={0} left={0} height="100%" color="black" style={{ overflowY: 'auto' }}>
        <ProfileSidebar traineeId={id} />
      </Box>
      <Box width="100%" paddingY="16px">
        <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
        <Box display="flex" justifyContent="flex-end" padding="16px">
          <LoadingButton variant="contained" loading={isSaveLoading} onClick={onClickEditButton}>
            {context.isEditMode ? 'Save' : 'Edit'}
          </LoadingButton>
          {context.isEditMode && (
            <Button variant="outlined" disabled={isSaveLoading} onClick={onCancelEdit}>
              Cancel
            </Button>
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

        {activeTab === 'personal' && <PersonalInfo personalInfo={traineeData!.personalInfo} />}
        {activeTab === 'contact' && (
          <ContactInfo contactData={traineeData && traineeData.contactInfo} saveTraineeData={saveTraineeData} />
        )}
        {activeTab === 'education' && (
          <EducationInfo educationData={traineeData && traineeData.educationInfo} saveTraineeData={saveTraineeData} />
        )}
        {activeTab === 'employment' && (
          <EmploymentInfo
            employmentData={traineeData && traineeData.employmentInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
        {activeTab === 'interactions' && <InteractionsInfo />}
      </Box>
    </div>
  );
};
