import { DeleteProfileDialog } from '../../../components/profile/DeleteProfileDialog';
import { ProfileActionsButton } from '../../../components/profile/ProfileActionsButton';
import { useDeleteOrganisation } from '../data/mutations';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface OrganisationActionsProps {
  organisationId: string;
  // Passed in instead of loading the organisation here, which must not load again once it is deleted.
  name: string;
}

/** The Actions button of the organisation profile, with the dialog to delete the organisation. */
export const OrganisationActions = ({ organisationId, name }: OrganisationActionsProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteOrganisation, isPending: isDeleting, error, reset } = useDeleteOrganisation(organisationId);

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    reset();
  };

  // Replaces the profile in the history, so going back does not open the deleted organisation.
  const handleDelete = () => {
    deleteOrganisation(undefined, {
      onSuccess: () => navigate('/organisations', { replace: true, state: { successMessage: `${name} was deleted` } }),
    });
  };

  return (
    <>
      <ProfileActionsButton
        actions={[{ label: 'Delete organisation', onClick: () => setIsDeleteDialogOpen(true), isDestructive: true }]}
      />
      <DeleteProfileDialog
        isOpen={isDeleteDialogOpen}
        profileType="organisation"
        name={name}
        relatedData="contact persons, interactions and logo"
        isDeleting={isDeleting}
        error={error?.message}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
};
