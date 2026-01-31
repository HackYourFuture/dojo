import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddTest, useDeleteTest, useEditTest, useGetTests } from '../../hooks/education/test-queries';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';
import { Test } from '../../../../models';
import { TestDetailsModal } from './TestDetailsModal';
import { TestsList } from './TestsList';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTraineeProfileContext } from '../../context/useTraineeProfileContext';

export const TestsComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalError, setModalError] = useState<string>('');
  const [testToEdit, setTestToEdit] = useState<Test | null>(null);
  const { traineeId } = useTraineeProfileContext();
  const { mutate: addTest, isPending: addTestLoading } = useAddTest(traineeId);
  const { mutate: deleteTest, isPending: deleteTestLoading, error: deleteTestError } = useDeleteTest(traineeId);
  const { mutate: editTest, isPending: editTestLoading } = useEditTest(traineeId);
  const { data: tests, isPending: testsLoading, error: testsError } = useGetTests(traineeId);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const [idToDelete, setIdToDelete] = useState<string>('');
  const queryClient = useQueryClient();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['tests', traineeId] });
    setIsModalOpen(false);
    setTestToEdit(null);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const test = tests?.find((test) => test.id === id) || null;

    setTestToEdit(test);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (test: Test) => {
    addTest(test, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (test: Test) => {
    editTest(test, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onClickDelete = (id: string) => {
    setIdToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  /**
   * Function to enable adding tests.
   */
  const onClickAdd = () => {
    setIsModalOpen(true);
  };

  /**
   * Function to enable adding tests.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setTestToEdit(null);
    setModalError('');
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    deleteTest(idToDelete, {
      onSuccess: () => {
        setIsConfirmationDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['tests', traineeId] });
      },
    });
  };

  return (
    <>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this test?"
        isLoading={deleteTestLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <div style={{ width: '50%' }}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" color="black" padding="16px">
            Tests ({tests?.length || 0})
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={onClickAdd}>
              New Test
            </Button>
          </Stack>
        </Box>

        {testsError || deleteTestError ? (
          <Alert severity="error">Oopsie! Something went wrong: {getErrorMessage(testsError || deleteTestError)}</Alert>
        ) : testsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <TestsList tests={tests || []} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
        )}

        <TestDetailsModal
          isLoading={addTestLoading || editTestLoading}
          error={modalError}
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirmAdd={onConfirmAdd}
          onConfirmEdit={onConfirmEdit}
          testToEdit={testToEdit}
        />
      </div>
    </>
  );
};
