import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { daysFromToday, today } from '../../../data/dates';
import { useAddMentorPairing, useDeleteMentorPairing, useEditMentorPairing } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { MentorPairing } from './MentorPairing';
import { MentorPairingDialog } from './components/MentorPairingDialog';
import { PairingList } from './components/PairingList';
import { ProfileSection } from '../../../components/profile/ProfileSection';
import { mentorPairingTypeLabels } from './MentorPairingType';
import { useGetMentorPairings } from './data/pairing-queries';
import { useState } from 'react';

// The pairing with a check-in today. A next check-in that has come is done, so the manager plans a new one.
const withCheckinToday = (pairing: MentorPairing): MentorPairing => ({
  ...pairing,
  lastCheckinDate: today(),
  nextCheckinDate:
    pairing.nextCheckinDate && daysFromToday(pairing.nextCheckinDate) > 0 ? pairing.nextCheckinDate : null,
});

interface VolunteerPairingsProps {
  volunteerId: string;
}

/** The pairings tab: the trainees the volunteer mentors, each added, edited and deleted on its own. */
export const VolunteerPairings = ({ volunteerId }: VolunteerPairingsProps) => {
  const { data: pairings, isPending, error } = useGetMentorPairings(volunteerId);
  const { mutate: addPairing, isPending: isAddLoading } = useAddMentorPairing(volunteerId);
  const { mutate: editPairing, isPending: isEditLoading } = useEditMentorPairing(volunteerId);
  const {
    mutate: deletePairing,
    isPending: isDeleteLoading,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteMentorPairing(volunteerId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState('');
  // The pairing being edited, or null while adding one.
  const [pairingToEdit, setPairingToEdit] = useState<MentorPairing | null>(null);
  // Logging a check-in edits the pairing, starting from a check-in today.
  const [isLoggingCheckin, setIsLoggingCheckin] = useState(false);
  // Kept after the confirmation closes, so its message does not disappear while it fades out.
  const [pairingToDelete, setPairingToDelete] = useState<MentorPairing | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const dialogTitle = isLoggingCheckin ? 'Log check-in' : pairingToEdit ? 'Edit pairing' : 'New pairing';
  const initialPairing = pairingToEdit && isLoggingCheckin ? withCheckinToday(pairingToEdit) : pairingToEdit;

  const deleteMessage = pairingToDelete
    ? `Are you sure you want to delete the ${mentorPairingTypeLabels[pairingToDelete.type]} pairing ` +
      `with ${pairingToDelete.trainee.name}?`
    : '';

  const openDialog = (pairing: MentorPairing | null, logsCheckin: boolean) => {
    setPairingToEdit(pairing);
    setIsLoggingCheckin(logsCheckin);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setPairingToEdit(null);
    setIsLoggingCheckin(false);
    setDialogError('');
  };

  const onSave = (pairing: MentorPairing) => {
    setDialogError('');
    const savePairing = pairingToEdit ? editPairing : addPairing;
    savePairing(pairing, {
      onSuccess: closeDialog,
      onError: (e) => {
        setDialogError(e.message);
      },
    });
  };

  const onClickDelete = (pairing: MentorPairing) => {
    setPairingToDelete(pairing);
    setIsConfirmationDialogOpen(true);
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    if (!pairingToDelete) {
      return;
    }
    deletePairing(pairingToDelete.id, {
      // Also closes on failure, so the error above the list is not hidden behind the dialog.
      onSettled: () => {
        setIsConfirmationDialogOpen(false);
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 1000 }}>
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
        title={`Pairings (${pairings?.length ?? 0})`}
        action={
          <Button startIcon={<AddIcon />} onClick={() => openDialog(null, false)}>
            New pairing
          </Button>
        }
      >
        {/* Closable, since it would otherwise stay until the next delete. */}
        {deleteError && (
          <Alert severity="error" onClose={resetDelete}>
            Error deleting the pairing: {deleteError.message}
          </Alert>
        )}
        {error ? (
          <Alert severity="error">Error loading the pairings: {error.message}</Alert>
        ) : isPending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <PairingList
            pairings={pairings ?? []}
            onLogCheckin={(pairing) => openDialog(pairing, true)}
            onEdit={(pairing) => openDialog(pairing, false)}
            onDelete={onClickDelete}
          />
        )}
      </ProfileSection>

      <MentorPairingDialog
        // A new key on every open and close resets the form.
        key={`${isDialogOpen}-${isLoggingCheckin}-${pairingToEdit?.id ?? 'new'}`}
        isOpen={isDialogOpen}
        isLoading={isAddLoading || isEditLoading}
        error={dialogError}
        title={dialogTitle}
        initialPairing={initialPairing}
        onClose={closeDialog}
        onSave={onSave}
      />
    </Box>
  );
};
