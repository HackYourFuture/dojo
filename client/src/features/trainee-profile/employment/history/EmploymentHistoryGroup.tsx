import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGetEmploymentHistory } from '../data/employment-queries';
import { useState } from 'react';
import { EmploymentHistory } from '../../../../data/types/Trainee';
import { EmploymentHistoryList } from '../EmploymentHistoryList';
import { EmploymentDetailsModal } from '../EmploymentDetailsModal';
import { useAddEmploymentHistory, useDeleteEmploymentHistory, useEditEmploymentHistory } from '../data/mutations';
import { useQueryClient } from '@tanstack/react-query';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';
import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';

export const EmploymentHistoryGroup = () => {
  const { traineeId } = useTraineeProfileContext();
  const [employmentToEdit, setEmploymentToEdit] = useState<EmploymentHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const { mutate: addEmployment, isPending: addEmploymentLoading } = useAddEmploymentHistory(traineeId);
  const {
    mutate: deleteEmployment,
    isPending: deleteEmploymentLoading,
    error: deleteEmploymentError,
  } = useDeleteEmploymentHistory(traineeId);
  const { mutate: editEmployment, isPending: editEmploymentLoading } = useEditEmploymentHistory(traineeId);
  const {
    data: employmentHistory,
    isPending: employmentHistoryLoading,
    error: employmentHistoryError,
  } = useGetEmploymentHistory(traineeId);
  const [idToDelete, setIdToDelete] = useState<string>('');
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['employmentHistory', traineeId] });
    setIsModalOpen(false);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  /**
   * Function to enable adding entries.
   */
  const onClickAdd = () => {
    setEmploymentToEdit(null);
    setIsModalOpen(true);
  };

  /**
   * Function to cancel adding employments.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setEmploymentToEdit(null);
    setModalError('');
  };

  const onClickEdit = (id: string) => {
    const employment = employmentHistory?.find((employment: EmploymentHistory) => employment.id === id) || null;

    setEmploymentToEdit(employment);
    setIsModalOpen(true);
  };

  const onClickDelete = (id: string) => {
    setIdToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  const onConfirmAdd = async (employment: EmploymentHistory) => {
    if (modalError) setModalError('');
    addEmployment(employment, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (employment: EmploymentHistory) => {
    if (modalError) setModalError('');
    editEmployment(employment, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    deleteEmployment(idToDelete, {
      onSuccess: () => {
        setIsConfirmationDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['employmentHistory', traineeId] });
      },
    });
  };

  return (
    <div style={{ width: '70ch' }}>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this employment history entry?"
        isLoading={deleteEmploymentLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" padding="16px">
          Employment history
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<AddIcon />} onClick={onClickAdd}>
            Add Employment
          </Button>
        </Stack>
      </Box>

      {employmentHistoryError || deleteEmploymentError ? (
        <Alert severity="error">
          Oopsie! Something went wrong: {getErrorMessage(employmentHistoryError || deleteEmploymentError)}
        </Alert>
      ) : employmentHistoryLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <EmploymentHistoryList employmentHistory={employmentHistory || []} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
      )}
      <EmploymentDetailsModal
        key={employmentToEdit?.id || `add-employment-${isModalOpen}`}
        isOpen={isModalOpen}
        error={modalError}
        isLoading={addEmploymentLoading || editEmploymentLoading}
        onClose={closeModal}
        onConfirmAdd={onConfirmAdd}
        onConfirmEdit={onConfirmEdit}
        initialEmployment={employmentToEdit}
      />
    </div>
  );
};