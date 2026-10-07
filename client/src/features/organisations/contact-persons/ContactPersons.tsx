import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useAddContactPerson, useDeleteContactPerson, useEditContactPerson } from './data/mutations';

import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { ContactPerson } from './ContactPerson';
import { ContactPersonDialog } from './components/ContactPersonDialog';
import { ContactPersonsList } from './components/ContactPersonsList';
import { ProfileSection } from '../../../components/profile/ProfileSection';
import { useGetContactPersons } from './data/contact-person-queries';
import { useState } from 'react';

interface ContactPersonsProps {
  organisationId: string;
}

/** The contacts section of the organisation tab, where contact persons are added, edited and deleted. */
export const ContactPersons = ({ organisationId }: ContactPersonsProps) => {
  const { data: contactPersons, isPending, error } = useGetContactPersons(organisationId);
  const { mutate: addContactPerson, isPending: isAddLoading } = useAddContactPerson(organisationId);
  const { mutate: editContactPerson, isPending: isEditLoading } = useEditContactPerson(organisationId);
  const {
    mutate: deleteContactPerson,
    isPending: isDeleteLoading,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteContactPerson(organisationId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState('');
  // The contact person being edited, or null while adding one.
  const [contactPersonToEdit, setContactPersonToEdit] = useState<ContactPerson | null>(null);
  // Kept after the confirmation closes, so the name in it does not disappear while it fades out.
  const [contactPersonToDelete, setContactPersonToDelete] = useState<ContactPerson | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const onClickAdd = () => {
    setIsDialogOpen(true);
  };

  const onClickEdit = (contactPerson: ContactPerson) => {
    setContactPersonToEdit(contactPerson);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setContactPersonToEdit(null);
    setDialogError('');
  };

  const onSave = (contactPerson: ContactPerson) => {
    setDialogError('');
    const saveContactPerson = contactPersonToEdit ? editContactPerson : addContactPerson;
    saveContactPerson(contactPerson, {
      onSuccess: closeDialog,
      onError: (e) => {
        setDialogError(e.message);
      },
    });
  };

  const onClickDelete = (contactPerson: ContactPerson) => {
    setContactPersonToDelete(contactPerson);
    setIsConfirmationDialogOpen(true);
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    if (!contactPersonToDelete) {
      return;
    }
    deleteContactPerson(contactPersonToDelete.id, {
      // Also closes on failure, so the error above the list is not hidden behind the dialog.
      onSettled: () => {
        setIsConfirmationDialogOpen(false);
      },
    });
  };

  return (
    // As wide as the employment history on the trainee profile, so the list does not stretch across a wide screen.
    <Box sx={{ maxWidth: '70ch' }}>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${contactPersonToDelete?.name}?`}
        isLoading={isDeleteLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <ProfileSection
        title="Contacts"
        action={
          <Button startIcon={<AddIcon />} onClick={onClickAdd}>
            Add Contact
          </Button>
        }
      >
        {/* Closable, since it would otherwise stay until the next delete. */}
        {deleteError && (
          <Alert severity="error" onClose={resetDelete}>
            Error deleting the contact: {deleteError.message}
          </Alert>
        )}
        {error ? (
          <Alert severity="error">Error loading the contacts: {error.message}</Alert>
        ) : isPending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ContactPersonsList
            contactPersons={contactPersons ?? []}
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
          />
        )}
      </ProfileSection>

      <ContactPersonDialog
        // A new key on every open and close resets the form.
        key={contactPersonToEdit?.id ?? `add-contact-person-${isDialogOpen}`}
        isOpen={isDialogOpen}
        isLoading={isAddLoading || isEditLoading}
        error={dialogError}
        initialContactPerson={contactPersonToEdit}
        onClose={closeDialog}
        onSave={onSave}
      />
    </Box>
  );
};
