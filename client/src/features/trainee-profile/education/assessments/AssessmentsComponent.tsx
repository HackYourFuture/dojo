import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddAssessment, useDeleteAssessment, useEditAssessment } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { Assessment } from './models/assessment';
import { AssessmentDetailsModal } from './components/AssessmentDetailsModal';
import { AssessmentsList } from './components/AssessmentsList';
import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';
import { useGetAssessments } from './data/assessment-queries';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';

export const AssessmentsComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalError, setModalError] = useState<string>('');
  const [initialAssessment, setInitialAssessment] = useState<Assessment | null>(null);
  const { traineeId } = useTraineeProfileContext();
  const { mutate: addAssessment, isPending: addAssessmentLoading } = useAddAssessment(traineeId);
  const {
    mutate: deleteAssessment,
    isPending: deleteAssessmentLoading,
    error: deleteAssessmentError,
  } = useDeleteAssessment(traineeId);
  const { mutate: editAssessment, isPending: editAssessmentLoading } = useEditAssessment(traineeId);
  const { data: assessments, isPending: assessmentsLoading, error: assessmentsError } = useGetAssessments(traineeId);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const [idToDelete, setIdToDelete] = useState<string>('');
  const handleSuccess = () => {
    setIsModalOpen(false);
    setInitialAssessment(null);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const assessment = assessments?.find((assessment) => assessment.id === id) || null;

    setInitialAssessment(assessment);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (assessment: Assessment) => {
    if (modalError) setModalError('');

    addAssessment(assessment, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError(e.message);
      },
    });
  };

  const onConfirmEdit = (assessment: Assessment) => {
    if (modalError) setModalError('');
    editAssessment(assessment, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError(e.message);
      },
    });
  };

  const onClickDelete = (id: string) => {
    setIdToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  /**
   * Function to enable adding assessments.
   */
  const onClickAdd = () => {
    setIsModalOpen(true);
  };

  /**
   * Function to close the assessment modal.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setInitialAssessment(null);
    setModalError('');
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    deleteAssessment(idToDelete, {
      onSuccess: () => {
        setIsConfirmationDialogOpen(false);
      },
    });
  };

  return (
    <>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this assessment?"
        isLoading={deleteAssessmentLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <div style={{ width: '50%' }}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" padding="16px">
            Assessments ({assessments?.length || 0})
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={onClickAdd}>
              New Assessment
            </Button>
          </Stack>
        </Box>

        {assessmentsError || deleteAssessmentError ? (
          <Alert severity="error">
            Oopsie! Something went wrong: {getErrorMessage(assessmentsError || deleteAssessmentError)}
          </Alert>
        ) : assessmentsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <AssessmentsList assessments={assessments || []} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
        )}

        <AssessmentDetailsModal
          key={initialAssessment?.id || `add-assessment-${isModalOpen}`} // Force remount to reset internal state when opening for a new assessment
          isLoading={addAssessmentLoading || editAssessmentLoading}
          error={modalError}
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirmAdd={onConfirmAdd}
          onConfirmEdit={onConfirmEdit}
          initialAssessment={initialAssessment}
        />
      </div>
    </>
  );
};
