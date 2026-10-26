import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { Mentorship } from '../Mentorship';
import { ProfileActionsButton } from '../../../components/profile/ProfileActionsButton';
import { useDeleteMentorship } from '../data/mutations';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface MentorshipActionsProps {
  // Passed in instead of loading it here, which must not happen again once it is deleted.
  mentorship: Mentorship;
}

/** The Actions button of the mentorship profile, with the dialog to delete the mentorship. */
export const MentorshipActions = ({ mentorship }: MentorshipActionsProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteMentorship, isPending: isDeleting, error, reset } = useDeleteMentorship(mentorship.id);
  const names = `${mentorship.volunteer.name} and ${mentorship.trainee.name}`;

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    reset();
  };

  // Replaces the profile in the history, so going back does not open the deleted mentorship.
  const handleDelete = () => {
    deleteMentorship(undefined, {
      onSuccess: () =>
        navigate('/mentorships', {
          replace: true,
          state: { successMessage: `The mentorship of ${names} was deleted` },
        }),
    });
  };

  return (
    <>
      <ProfileActionsButton
        actions={[{ label: 'Delete mentorship', onClick: () => setIsDeleteDialogOpen(true), isDestructive: true }]}
      />
      {/* Only a confirmation, with no name to type as on the other profiles: a mentorship is quick to make again. */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Delete mentorship"
        message={`This permanently deletes the mentorship of ${names} with its check-ins. This cannot be undone.`}
        confirmButtonText="Delete mentorship"
        isLoading={isDeleting}
        error={error?.message}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
};
