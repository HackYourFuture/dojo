import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useAddMentorshipCheckin, useDeleteMentorshipCheckin, useEditMentorshipCheckin } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { Mentorship } from '../Mentorship';
import { MentorshipCheckin } from './MentorshipCheckin';
import { MentorshipCheckinDialog } from './components/MentorshipCheckinDialog';
import { MentorshipCheckinsList } from './components/MentorshipCheckinsList';
import { ProfileSection } from '../../../components/profile/ProfileSection';
import { daysFromToday, formatDateForDisplay } from '../../../data/dates';
import { useGetMentorshipCheckins } from './data/checkin-queries';
import { useState } from 'react';

interface MentorshipCheckinsProps {
  // The saved mentorship, not the edited copy.
  mentorship: Mentorship;
  // Whether the details are being edited, which adding a check-in must not get in the way of.
  isEditing: boolean;
}

/** The check-ins of a mentorship, added, edited and deleted on their own, apart from editing the profile. */
export const MentorshipCheckins = ({ mentorship, isEditing }: MentorshipCheckinsProps) => {
  const mentorshipId = mentorship.id;
  const { data: checkins, isPending, error } = useGetMentorshipCheckins(mentorshipId);
  const { mutate: addCheckin, isPending: isAddLoading } = useAddMentorshipCheckin(mentorship);
  const { mutate: editCheckin, isPending: isEditLoading } = useEditMentorshipCheckin(mentorshipId);
  const {
    mutate: deleteCheckin,
    isPending: isDeleteLoading,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteMentorshipCheckin(mentorshipId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState('');
  // The check-in being edited, or null while adding one.
  const [checkinToEdit, setCheckinToEdit] = useState<MentorshipCheckin | null>(null);
  // Kept after the confirmation closes, so its date does not disappear while it fades out.
  const [checkinToDelete, setCheckinToDelete] = useState<MentorshipCheckin | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  // A next check-in that is due or past is the one being logged, so the dialog starts without it.
  const plannedNextCheckinDate =
    mentorship.nextCheckinDate && daysFromToday(mentorship.nextCheckinDate) > 0 ? mentorship.nextCheckinDate : null;

  const deleteMessage = checkinToDelete
    ? `Are you sure you want to delete the check-in of ${formatDateForDisplay(checkinToDelete.date)}?`
    : '';

  const onClickAdd = () => {
    setIsDialogOpen(true);
  };

  const onClickEdit = (checkin: MentorshipCheckin) => {
    setCheckinToEdit(checkin);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCheckinToEdit(null);
    setDialogError('');
  };

  const onSave = (checkin: MentorshipCheckin, nextCheckinDate: Date | null) => {
    setDialogError('');
    const options = {
      onSuccess: closeDialog,
      onError: (e: Error) => {
        setDialogError(e.message);
      },
    };
    if (checkinToEdit) {
      editCheckin(checkin, options);
    } else {
      addCheckin({ checkin, nextCheckinDate }, options);
    }
  };

  const onClickDelete = (checkin: MentorshipCheckin) => {
    setCheckinToDelete(checkin);
    setIsConfirmationDialogOpen(true);
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    if (!checkinToDelete) {
      return;
    }
    deleteCheckin(checkinToDelete.id, {
      // Also closes on failure, so the error above the list is not hidden behind the dialog.
      onSettled: () => {
        setIsConfirmationDialogOpen(false);
      },
    });
  };

  return (
    // As wide as the other profile lists, so the notes do not stretch across a wide screen.
    <Box sx={{ maxWidth: '70ch' }}>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message={deleteMessage}
        isLoading={isDeleteLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <ProfileSection
        title="Check-ins"
        action={
          // Adding a check-in saves the mentorship too, which would be undone by saving the edit in progress.
          <Button startIcon={<AddIcon />} disabled={isEditing} onClick={onClickAdd}>
            Add Check-in
          </Button>
        }
      >
        {/* Closable, since it would otherwise stay until the next delete. */}
        {deleteError && (
          <Alert severity="error" onClose={resetDelete}>
            Error deleting the check-in: {deleteError.message}
          </Alert>
        )}
        {error ? (
          <Alert severity="error">Error loading the check-ins: {error.message}</Alert>
        ) : isPending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <MentorshipCheckinsList checkins={checkins ?? []} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
        )}
      </ProfileSection>

      <MentorshipCheckinDialog
        // A new key on every open and close resets the form.
        key={checkinToEdit?.id ?? `add-checkin-${isDialogOpen}`}
        isOpen={isDialogOpen}
        isLoading={isAddLoading || isEditLoading}
        error={dialogError}
        initialCheckin={checkinToEdit}
        nextCheckinDate={plannedNextCheckinDate}
        onClose={closeDialog}
        onSave={onSave}
      />
    </Box>
  );
};
