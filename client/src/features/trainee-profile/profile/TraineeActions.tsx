import { DeleteProfileDialog } from '../../../components/profile/DeleteProfileDialog';
import { ProfileActionsButton } from '../../../components/profile/ProfileActionsButton';
import { useDeleteTrainee } from '../data/mutations';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface TraineeActionsProps {
  traineeId: string;
  // Passed in instead of loading the trainee here, which must not load again once it is deleted.
  name: string;
}

/** The Actions button of the trainee profile, with the dialog to delete the trainee. */
export const TraineeActions = ({ traineeId, name }: TraineeActionsProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteTrainee, isPending: isDeleting, error, reset } = useDeleteTrainee(traineeId);

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    reset();
  };

  // Replaces the profile in the history, so going back does not open the deleted trainee.
  const handleDelete = () => {
    deleteTrainee(undefined, {
      onSuccess: () => navigate('/trainees', { replace: true, state: { successMessage: `${name} was deleted` } }),
    });
  };

  return (
    <>
      <ProfileActionsButton
        actions={[{ label: 'Delete trainee', onClick: () => setIsDeleteDialogOpen(true), isDestructive: true }]}
      />
      <DeleteProfileDialog
        isOpen={isDeleteDialogOpen}
        profileType="trainee"
        name={name}
        relatedData="interactions, assessments, employment history and profile picture"
        isDeleting={isDeleting}
        error={error?.message}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
};
