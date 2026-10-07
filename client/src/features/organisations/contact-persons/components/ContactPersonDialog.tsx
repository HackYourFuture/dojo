import { ChangeEvent, useState } from 'react';
import { Stack, TextField } from '@mui/material';

import { ContactPerson } from '../ContactPerson';
import { FormDialog } from '../../../../components/FormDialog';
import { nameValidationError } from '../../../../data/text';

interface ContactPersonDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  // The contact person to edit, or null to add a new one.
  initialContactPerson: ContactPerson | null;
  onClose: () => void;
  onSave: (contactPerson: ContactPerson) => void;
}

const NEW_CONTACT_PERSON: ContactPerson = {
  id: '',
  name: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  jobTitle: '',
  notes: '',
};

/** The dialog to add a contact person, or to edit initialContactPerson when it is set. */
export const ContactPersonDialog = ({
  isOpen,
  isLoading,
  error,
  initialContactPerson,
  onClose,
  onSave,
}: ContactPersonDialogProps) => {
  const [contactPerson, setContactPerson] = useState<ContactPerson>(initialContactPerson ?? NEW_CONTACT_PERSON);
  const [nameError, setNameError] = useState<string | null>(null);

  const isEditMode = Boolean(initialContactPerson);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setNameError(null);
    }
    setContactPerson((prevContactPerson) => ({ ...prevContactPerson, [name]: value }));
  };

  const handleSubmit = () => {
    // The server checks the other fields, and its message is shown below the form.
    const validationError = nameValidationError(contactPerson.name);
    if (validationError) {
      setNameError(validationError);
      return;
    }
    onSave(contactPerson);
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title={isEditMode ? 'Edit contact' : 'New contact'}
      submitLabel={isEditMode ? 'Save' : 'Add'}
      isSaving={isLoading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {/* No ids, so MUI generates them: the profile's inputs use these names as ids while it is edited. */}
      {/* Aligned to the top, so the name's error message does not stretch the job title. */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <TextField
          required
          disabled={isLoading}
          name="name"
          label="Name"
          value={contactPerson.name}
          onChange={handleTextChange}
          error={!!nameError}
          helperText={nameError}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: 1 }}
        />
        <TextField
          disabled={isLoading}
          name="jobTitle"
          label="Job title"
          value={contactPerson.jobTitle ?? ''}
          onChange={handleTextChange}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          disabled={isLoading}
          name="email"
          label="Email"
          type="email"
          value={contactPerson.email ?? ''}
          onChange={handleTextChange}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: 1 }}
        />
        <TextField
          disabled={isLoading}
          name="phone"
          label="Phone"
          type="tel"
          value={contactPerson.phone ?? ''}
          onChange={handleTextChange}
          slotProps={{ htmlInput: { maxLength: 30 } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <TextField
        disabled={isLoading}
        name="linkedinUrl"
        label="LinkedIn"
        type="url"
        placeholder="https://www.linkedin.com/in/example"
        value={contactPerson.linkedinUrl ?? ''}
        onChange={handleTextChange}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
      <TextField
        disabled={isLoading}
        name="notes"
        label="Notes"
        multiline
        minRows={2}
        maxRows={6}
        value={contactPerson.notes ?? ''}
        onChange={handleTextChange}
        slotProps={{ htmlInput: { maxLength: 5000 } }}
      />
    </FormDialog>
  );
};
