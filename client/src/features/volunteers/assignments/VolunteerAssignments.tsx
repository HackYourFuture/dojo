import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAddVolunteerAssignment, useDeleteVolunteerAssignment, useEditVolunteerAssignment } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { VolunteerAssignment } from './VolunteerAssignment';
import { VolunteerAssignmentDialog } from './components/VolunteerAssignmentDialog';
import { VolunteerAssignmentsTable } from './components/VolunteerAssignmentsTable';
import { formatDateForDisplay } from '../../../data/dates';
import { useGetVolunteerAssignments } from './data/assignment-queries';
import { useState } from 'react';
import { volunteerAssignmentTypeLabels } from '../VolunteerAssignmentType';

interface VolunteerAssignmentsProps {
  volunteerId: string;
}

/** The assignments of a volunteer, added, edited and deleted on their own, apart from editing the profile. */
export const VolunteerAssignments = ({ volunteerId }: VolunteerAssignmentsProps) => {
  const { data: assignments, isPending, error } = useGetVolunteerAssignments(volunteerId);
  const { mutate: addAssignment, isPending: isAddLoading } = useAddVolunteerAssignment(volunteerId);
  const { mutate: editAssignment, isPending: isEditLoading } = useEditVolunteerAssignment(volunteerId);
  const {
    mutate: deleteAssignment,
    isPending: isDeleteLoading,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteVolunteerAssignment(volunteerId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState('');
  // The assignment being edited, or null while adding one.
  const [assignmentToEdit, setAssignmentToEdit] = useState<VolunteerAssignment | null>(null);
  // Kept after the confirmation closes, so its message does not disappear while it fades out.
  const [assignmentToDelete, setAssignmentToDelete] = useState<VolunteerAssignment | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  // Assignments without an estimate add no hours.
  const totalHours = (assignments ?? []).reduce((sum, assignment) => sum + (assignment.estimatedHours ?? 0), 0);
  const title = totalHours > 0 ? `Assignments (${totalHours} ${totalHours === 1 ? 'hour' : 'hours'})` : 'Assignments';

  const deleteMessage = assignmentToDelete
    ? `Are you sure you want to delete the ${volunteerAssignmentTypeLabels[assignmentToDelete.type]} assignment ` +
      `that started on ${formatDateForDisplay(assignmentToDelete.startDate)}?`
    : '';

  const onClickAdd = () => {
    setIsDialogOpen(true);
  };

  const onClickEdit = (assignment: VolunteerAssignment) => {
    setAssignmentToEdit(assignment);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setAssignmentToEdit(null);
    setDialogError('');
  };

  const onSave = (assignment: VolunteerAssignment) => {
    setDialogError('');
    const saveAssignment = assignmentToEdit ? editAssignment : addAssignment;
    saveAssignment(assignment, {
      onSuccess: closeDialog,
      onError: (e) => {
        setDialogError(e.message);
      },
    });
  };

  const onClickDelete = (assignment: VolunteerAssignment) => {
    setAssignmentToDelete(assignment);
    setIsConfirmationDialogOpen(true);
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    if (!assignmentToDelete) {
      return;
    }
    deleteAssignment(assignmentToDelete.id, {
      // Also closes on failure, so the error above the table is not hidden behind the dialog.
      onSettled: () => {
        setIsConfirmationDialogOpen(false);
      },
    });
  };

  return (
    <Stack spacing={2} useFlexGap>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message={deleteMessage}
        isLoading={isDeleteLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      {/* Like a section title, one size smaller, as the table is part of the volunteering section. */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Button startIcon={<AddIcon />} onClick={onClickAdd}>
          Add Assignment
        </Button>
      </Stack>
      {/* Closable, since it would otherwise stay until the next delete. */}
      {deleteError && (
        <Alert severity="error" onClose={resetDelete}>
          Error deleting the assignment: {deleteError.message}
        </Alert>
      )}
      {error ? (
        <Alert severity="error">Error loading the assignments: {error.message}</Alert>
      ) : isPending ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <VolunteerAssignmentsTable
          assignments={assignments ?? []}
          onClickEdit={onClickEdit}
          onClickDelete={onClickDelete}
        />
      )}

      <VolunteerAssignmentDialog
        // A new key on every open and close resets the form.
        key={assignmentToEdit?.id ?? `add-assignment-${isDialogOpen}`}
        isOpen={isDialogOpen}
        isLoading={isAddLoading || isEditLoading}
        error={dialogError}
        initialAssignment={assignmentToEdit}
        onClose={closeDialog}
        onSave={onSave}
      />
    </Stack>
  );
};
