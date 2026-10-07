import { DeleteProfileDialog } from '../../../components/profile/DeleteProfileDialog';
import { ProfileActionsButton } from '../../../components/profile/ProfileActionsButton';
import { useDeleteVolunteer } from '../data/mutations';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface VolunteerActionsProps {
  volunteerId: string;
  // Passed in instead of loading the volunteer here, which must not load again once it is deleted.
  name: string;
}

/** The Actions button of the volunteer profile, with the dialog to delete the volunteer. */
export const VolunteerActions = ({ volunteerId, name }: VolunteerActionsProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteVolunteer, isPending: isDeleting, error, reset } = useDeleteVolunteer(volunteerId);

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    reset();
  };

  // Replaces the profile in the history, so going back does not open the deleted volunteer.
  const handleDelete = () => {
    deleteVolunteer(undefined, {
      onSuccess: () => navigate('/volunteers', { replace: true, state: { successMessage: `${name} was deleted` } }),
    });
  };

  return (
    <>
      <ProfileActionsButton
        actions={[{ label: 'Delete volunteer', onClick: () => setIsDeleteDialogOpen(true), isDestructive: true }]}
      />
      <DeleteProfileDialog
        isOpen={isDeleteDialogOpen}
        profileType="volunteer"
        name={name}
        relatedData="interactions and profile picture"
        isDeleting={isDeleting}
        error={error?.message}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
};
